from pathlib import Path
from shapely.geometry import Polygon, MultiPolygon, GeometryCollection

def _polygons(geometry):
    """polygon componenets from shapely geometry"""

    if isinstance(geometry,Polygon):
        yield geometry
    elif isinstance(geometry, (MultiPolygon,GeometryCollection)):
        for part in geometry.geoms:
            yield from _polygons(part)


def save_packing_preview(page,placements,output):
    """Save an svg preview of a page and its placed sticker outlines."""

    output = Path(output)

    min_x, min_y, max_x, max_y = page.bounds
    page_width = max_x - min_x
    page_height = max_y - min_y

    if page_width <= 0 or page_height <= 0:
        raise ValueError("Page must have positive width and height")

    padding= 20
    max_size = 800
    scale = min(
        max_size / page_width,
        max_size/page_height,
    )

    width = page_width * scale + 2* padding
    height = page_height * scale + 2 * padding

    def point(x,y):
        screen_x = padding + (x- min_x) * scale
        screen_y = padding + (max_y -y) * scale
        return screen_x, screen_y

    def ring_path(ring):
        coords = list(ring.coords)
        if not coords:
            return ""

        x,y = point(*coords[0])
        commands = [f"M {x:.3f} {y:.3f}"]

        for coord in coords[1:]:
            x, y = point(*coord)
            commands.append(f"L {x:.3f} {y:.3f}")

        commands.append("Z")
        return " ".join(commands)

    output_lines = [
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'width="{width:.1f}" height="{height:.1f}" '
        f'viewBox="0 0 {width:.1f} {height:.1f}">',
        '<rect width="100%" height="100%" fill="white"/>',
        (
            f'<rect x="{padding}" y="{padding}" '
            f'width="{page_width * scale:.3f}" '
            f'height="{page_height * scale:.3f}" '
            'fill="#f7f7f7" stroke="#333" stroke-width="1.5"/>'
        ),
    ]

    for _, geometry in placements:
        for polygon in _polygons(geometry):
            paths = [ring_path(polygon.exterior)]
            paths.extend(ring_path(ring) for ring in polygon.interiors)
            path_data = " ".join(paths)

            output_lines.append(
                f'<path d="{path_data}" '
                'fill="#8ecae6" fill-rule="evenodd" '
                'stroke="#126782" stroke-width="1.2" '
                'stroke-linejoin="round"/>'
            )

    output_lines.append("</svg>")

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(
        "\n".join(output_lines)
    )