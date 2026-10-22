from pathlib import Path
import xml.etree.ElementTree as ET

from shapely.geometry import Polygon
from shapely.ops import unary_union
from svgpathtools import parse_path

def _local_tag(element):
    """Return an SVG element's tag without the XML namespace, for testing/parsing."""
    return element.tag.rsplit("}",1)[-1]

def _sample_path(path_data,samples_per_curve=12):
    """Convert an SVG path into sampled coordinate pairs.
    
    Raises:
        ValueError: If the path is empty, discontinuous, or open.
    """
    path = parse_path(path_data)

    if len(path) == 0:
        raise ValueError("Sticker SVG contains an empty path")

    # Check continuity before isclosed(), which asserts continuity
    if not path.iscontinuous():
        raise ValueError(
            "Sticker SVG path contains disconnecte segments; " 
            "each sticker must have one continuous outline"
        )

    if not path.isclosed():
        raise ValueError(
            "Sticker SVG path is open; each sticker must have "
            "one closed outline"
        )
    
    points = []

    for segment in path:
        if not points:
            points.append((segment.start.real, segment.start.imag))

        # sampling handles lines and curves with the same interface
        for i in range(1, samples_per_curve+1):
            point = segment.point(i/samples_per_curve)
            points.append((point.real, point.imag))

    if len(points) < 4:
        raise ValueError("Sticker SVG path has too few points")

    return points

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

def load_sticker_svg(path:str | Path):
    """Load one svg file and return its combined sticker outline.
    
    Returns:
        A Shapely polygon or multipolygon (like a polygon but multi)
        
    Raises:
        FileNotFoundError: If the SVG file doesn't exist.
        ValueError: If the SVG contains no usable geometry.
    """

    path = Path(path)

    if not path.is_file():
        raise FileNotFoundError(path)

    try:
        root = ET.parse(path).getroot()
    except ET.ParseError as exc:
        raise ValueError(f"Invalid SVG file: {path}") from exc

    polygons = []

    for element in root.iter():
        tag = _local_tag(element)

        if tag == "path":
            path_data = element.get("d", "").strip()
            if not path_data:
                continue

            try:
                points = _sample_path(path_data)
            except (ValueError, TypeError, ZeroDivisionError):
                continue

            if points:
                polygon = Polygon(points)
                if polygon.is_valid and polygon.area > 0:
                    polygons.append(polygon)

        elif tag in {"polygon", "polyline"}:
            points_text = element.get("points","")
            points = _parse_points(points_text)

            if tag == "polyline" and points:
                if points[0] != points[-1]:
                    continue

            polygon = Polygon(points)
            if polygon.is_valid and polygon.area > 0:
                polygons.append(polygon)

    if not polygons:
        raise ValueError("No usable sticker geometry")

    geometry = unary_union(polygons)

    if geometry.is_empty or not geometry.is_valid or geometry.area <= 0:
        raise ValueError("no usable sticker geometry")

    return geometry
