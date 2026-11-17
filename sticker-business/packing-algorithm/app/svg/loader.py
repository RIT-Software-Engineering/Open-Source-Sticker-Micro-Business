from pathlib import Path
import re
import xml.etree.ElementTree as ET
from shapely.affinity import scale
from shapely.geometry import Polygon
from shapely.ops import unary_union
from svgpathtools import parse_path
import math

def _local_tag(element):
    """Return an SVG element's tag without the XML namespace, for testing/parsing."""
    return element.tag.rsplit("}",1)[-1]

def _split_subpaths(path_data):
    """Split SVG path data at moveto commands into seperate subpaths."""
    # An uppercase or lowercase M starts a subpath
    # exponents can't be mistaken as commands
    starts = [
        match.start()
        for match in re.finditer(r"[Mm]", path_data)
    ]

    if not starts:
        return []

    starts.append(len(path_data))

    return [
        path_data[starts[i]:starts[i+1]].strip()
        for i in range(len(starts) - 1)
        if path_data[starts[i]:starts[i+1]].strip()
    ]

def _sample_closed_path(path_data, samples_per_curve=12):
    """Convert one closed psubpath into polygon coordinates"""
    path = parse_path(path_data)

    if len(path) == 0:
        return None

    #check continuity
    if not path.iscontinuous() or not path.isclosed():
        return None

    points = []

    for segment in path:
        if not points:
            points.append(
                (segment.start.real, segment.start.imag)
            )

        for i in range(1, samples_per_curve+1):
            point = segment.point(i/samples_per_curve)
            points.append((point.real, point.imag))

    if len(points) < 4:
        return None

    polygon = Polygon(points)

    if polygon.is_empty or not polygon.is_valid or polygon.area <= 0:
        return None

    return polygon    



def _parse_points(points_text):
    """Parse the points attribute of an SVG polygon or line."""
    import re
    values = re.findall(
        r"[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][]?\d+)?",
        points_text,
    )

    if len(values) < 6 or len(values) % 2:
        return []

    numbers = [float(value) for value in values]
    return list(zip(numbers[::2], numbers[1::2]))

def _read_polygons(root):
    """Extract closed polygon geometry from supported SVG elements."""
    polygons = []
    for element in root.iter():
        tag = _local_tag(element)

        if tag == "path":
            path_data = element.get("d","").strip()

            for subpath_data in _split_subpaths(path_data):
                try:
                    polygon = _sample_closed_path(subpath_data)
                except (ValueError, AssertionError, ZeroDivisionError):
                    polygon = None

                if polygon is not None:
                    polygons.append(polygon)

        elif tag in {"polygon", "polyline"}:
            points = _parse_points(element.get("points", ""))

            if tag == "polyline" and points and points[0] != points[-1]:
                continue

            if len(points) >= 3:
                polygon = Polygon(points)

                if polygon.is_valid and polygon.area > 0:
                    polygons.append(polygon)

    return polygons

def load_sticker_svg(
    path: str | Path,
    *,
    merge_tolerance: float = 0.0,
    width_cm: float | None = None,
    height_cm: float | None = None,
):
    """Load one sticker SVG and return its exterior silhouette.

    Args:
        path: SVG file path.
        merge_tolerance: Maximum geometric closing distance, in SVG units.
            Zero merges touching shapes but does not bridge gaps.

    Returns:
        A Shapely Polygon representing the sticker's outside outline.

    Raises:
        FileNotFoundError: If the file does not exist.
        ValueError: If no usable single sticker outline can be extracted.
    """
    path = Path(path)

    if not path.is_file():
        raise FileNotFoundError(path)

    if merge_tolerance < 0:
        raise ValueError("merge_tolerance cannot be negative")

    try:
        root = ET.parse(path).getroot()
    except ET.ParseError as exc:
        raise ValueError(f"Invalid SVG file: {path}") from exc

    polygons = _read_polygons(root)

    if not polygons:
        raise ValueError("no usable sticker geometry")

    geometry = unary_union(polygons)

    # Close small gaps, then restore the original overall scale as much
    # as possible. This is a geometric closing operation.
    if merge_tolerance > 0:
        geometry = (
            geometry.buffer(merge_tolerance)
            .buffer(-merge_tolerance)
        )

    # The cutter needs one continuous exterior outline.
    if geometry.geom_type == "MultiPolygon":
        raise ValueError(
            "Sticker geometry contains disconnected components. "
            "Increase merge_tolerance only if the gaps are unintended."
        )

    if geometry.geom_type != "Polygon" or geometry.is_empty:
        raise ValueError("no usable sticker geometry")

    if not geometry.is_valid or geometry.area <= 0:
        raise ValueError("no usable sticker geometry")

    # Return only the exterior silhouette, discarding interior rings.
    geometry = scale(
        Polygon(geometry.exterior),
        xfact=1,
        yfact=-1,
        origin="center",
    )
    # physical sizing
    if(width_cm is None) != (height_cm is None):
        raise ValueError(
            "Both width_cm and height_cm must be provided"
        )
    if(width_cm is not None):
        if (
            not math.isfinite(width_cm)
            or not math.isfinite(height_cm)
            or width_cm <= 0
            or height_cm <= 0
        ):
            raise ValueError(
                "Sticker dimensions must be positive and finite"
            )

        min_x, min_y, max_x, max_y = geometry.bounds
        original_width = max_x - min_x
        original_height = max_y - min_y

        if original_width <= 0 or original_height <= 0:
            raise ValueError("Sticker geometry has invalid dimensions.")

        scale_factor = width_cm / original_width
        calculated_height = original_height * scale_factor

        if not math.isclose(
            calculated_height,
            height_cm,
            rel_tol=1e-6,
            abs_tol=1e-9,
        ):
            raise ValueError(
                "Requested dimensions do not match the SVG aspect ratio."
            )

        geometry = scale(
            geometry,
            xfact=scale_factor,
            yfact=scale_factor,
            origin="center",
        )

    return geometry
    

def load_sticker_geometry(sticker, *, merge_tolerance=0.0):
    """Load a sticker's SVG using its database dimensions in cm"""
    if not sticker.svg_path:
        raise ValueError("Sticker does not have an SVG path.")


    return load_sticker_svg(
        sticker.svg_path,
        merge_tolerance=merge_tolerance,
        width_cm = sticker.width_cm,
        height_cm = sticker.height_cm
    )