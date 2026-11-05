from pathlib import Path
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.graphics import renderPDF
from svglib.svglib import svg2rlg
from shapely.affinity import rotate, translate

PAGE_SIZE = (5.5*inch, 8.5*inch)

def _get_rotation(original,placed):
    """Determine how far the placed is rotated"""

    for angle in (0,90,180,270):
        rotated = rotate(
            original,
            angle,
            origin='centroid',
        )

        min_x,min_y, _, _ = rotated.bounds
        placed_min_x, placed_min_y,_,_ = placed.bounds

        candidate = translate(
            rotated,
            xoff = placed_min_x - min_x,
            yoff = placed_min_y - min_y,
        )

        if candidate.equals(placed):
            return angle

    raise ValueError(
        "Could not determine sticker rotation from placement geometry"
    )


def save_pdf(placements, sticker_paths, output):
    """Export packed stickers as a full-color half-letter PDF.

    Args:
        placements: List of (original_geometry, placed_geometry) pairs.
        sticker_paths: Dictionary mapping id(original_geometry) to SVG paths.
        output: Destination PDF file path."""

    output = Path(output)
    output.parent.mkdir(parents=True, exist_ok=True)

    pdf = canvas.Canvas(str(output), pagesize = PAGE_SIZE)

    for original, placed in placements:
        svg_path = sticker_paths.get(id(original))

        if not svg_path:
            raise ValueError(
                "No SVG artwork path found for a packed sticker."
            )

        svg_path = Path(svg_path)
        if not svg_path.is_file():
            raise FileNotFoundError(svg_path)

        drawing = svg2rlg(str(svg_path))

        if drawing is None or not drawing.width or not drawing.height:
            raise ValueError(
                f"Could not load SVG artwork: {svg_path}"
            )

        min_x,min_y,max_x,max_y = original.bounds
        placed_min_x,placed_min_y,_,_ = placed.bounds

        geometry_width = max_x - min_x
        geometry_height = max_y - min_y

        #preserving aspect ratio

        scale = min(
            geometry_width / drawing.width,
            geometry_height / drawing.height
        )

        artwork_width = drawing.width * scale
        artwork_height = drawing.height * scale

        # Center the artwork inside its original geometry bounds.
        artwork_x = min_x + (geometry_width - artwork_width) / 2
        artwork_y = min_y + (geometry_height - artwork_height) / 2

        angle = _get_rotation(original, placed)

        # Align the rotated geometry with its packed position.
        rotated = rotate(original, angle, origin="centroid")
        rotated_min_x, rotated_min_y, _, _ = rotated.bounds

        offset_x = placed_min_x - rotated_min_x
        offset_y = placed_min_y - rotated_min_y

        pdf.saveState()
        # Apply the same rotation and translation as the packing algorithm.
        centroid_x, centroid_y = original.centroid.coords[0]

        pdf.translate(offset_x, offset_y)
        pdf.translate(centroid_x, centroid_y)
        pdf.rotate(angle)
        pdf.translate(-centroid_x, -centroid_y)

        pdf.translate(artwork_x, artwork_y)
        pdf.scale(scale, scale)

        renderPDF.draw(drawing, pdf, 0, 0)

        pdf.restoreState()

    pdf.save()