from pathlib import Path
from app.pdf.output import save_pdf
import pytest
from pypdf import PdfReader
from shapely.geometry import box
import fitz
from app.models.sticker import Sticker

def test_pdf_file_is_created(tmp_path):
    sticker = box(0,0,20,10)
    placed = box(10,10,30,20)
    placements = [(sticker,placed)]

    sticker_paths = {
        id(sticker): "tests/fixtures/tetrispieceI.svg"
    }

    output = tmp_path / "stickers.pdf"

    save_pdf(placements, sticker_paths, output)

    assert output.exists()
    assert output.stat().st_size > 0

def test_pdf_uses_half_letter_page_size(tmp_path):
    sticker = box(0,0,20,10)
    placed = box(10,10,30,20)

    placements = [(sticker,placed)]
    sticker_paths = {
        id(sticker): "tests/fixtures/tetrispieceI.svg"
    }

    output = tmp_path / "stickers.pdf"

    save_pdf(placements, sticker_paths, output)
    reader = PdfReader(str(output))
    page = reader.pages[0]

    assert float(page.mediabox.width) == pytest.approx(396)
    assert float(page.mediabox.height) == pytest.approx(612)

def make_svg(path, color="red",width=20,height=10):
    """Create a simple svg fixture"""

    path.write_text(
        f"""<svg xmlns="http://www.w3.org/2000/svg"
             width="{width}" height="{height}"
             viewBox="0 0 {width} {height}">
            <rect width="{width}" height="{height}" fill="{color}"/>
        </svg>""",
        encoding="utf-8",
    )
    return path

def render_pdf(output):
    """Render the first pdf as a pixmap"""
    document = fitz.open(output)
    page = document[0]
    pixmap = page.get_pixmap()
    return pixmap, page

def pixel_at(pixmap,x,y):
    """return rgb at a pdf point coordinate"""
    x=round(x * pixmap.width / 396)
    y = round((612-y) * pixmap.height / 612)
    offset = (y*pixmap.width + x) * pixmap.n
    return tuple(pixmap.samples[offset:offset+3])


def test_artwork_appears_at_packed_position(tmp_path):
    sticker = box(0,0,20,10)
    placed = box(100,100,120,110)
    artwork = make_svg(tmp_path/"sticker.svg")
    output = tmp_path/"stickers.pdf"

    save_pdf(
        [(sticker,placed)],
        {id(sticker): artwork},
        output,
    )

    pixmap, _ = render_pdf(output)

    # PDF coordinates are measured from the bottom-left.
    # Convert the intended point to top-left raster coordinates.
    red = pixel_at(pixmap, 110, 105)

    assert red[0] > 200
    assert red[1] < 100
    assert red[2] < 100


def test_artwork_is_not_drawn_at_original_position(tmp_path):
    sticker = box(0, 0, 20, 10)
    placed = box(100, 100, 120, 110)
    artwork = make_svg(tmp_path / "sticker.svg")
    output = tmp_path / "stickers.pdf"

    save_pdf(
        [(sticker, placed)],
        {id(sticker): artwork},
        output,
    )

    pixmap, _ = render_pdf(output)

    # This point is inside the page but outside the placed sticker.
    red = pixel_at(pixmap, 10, 10)

    assert not (red[0] > 200 and red[1] < 100 and red[2] < 100)


def test_rotated_sticker_artwork_matches_placement(tmp_path):
    sticker = box(0, 0, 20, 10)
    placed = box(100, 100, 110, 120)

    artwork = tmp_path/"sticker.svg"

    artwork.write_text(
        """<svg xmlns="http://www.w3.org/2000/svg"
            width="20" height="10" viewBox="0 0 20 10">
            <rect x="0" y="0" width="10" height="10" fill="red"/>
            <rect x="10" y="0" width="10" height="10" fill="blue"/>
        </svg>""",
        encoding="utf-8",
    )

   

    output = tmp_path / "stickers.pdf"

    save_pdf(
        [(sticker, placed)],
        {id(sticker): artwork},
        output,
    )

    pixmap, _ = render_pdf(output)

    # A point inside the rotated sticker should contain blue artwork.
    blue = pixel_at(pixmap, 105, 115)

    assert blue[2] > 200
    assert blue[0] < 100
    assert blue[1] < 100

    red = pixel_at(pixmap, 105, 105)

    assert red[0] > 200
    assert red[1] < 100
    assert red[2] < 100


def test_original_svg_color_is_preserved(tmp_path):
    sticker = box(0, 0, 20, 10)
    artwork = make_svg(
        tmp_path / "sticker.svg",
        color="#00cc00",
    )

    output = tmp_path / "stickers.pdf"

    save_pdf(
        [(sticker, sticker)],
        {id(sticker): artwork},
        output,
    )

    pixmap, _ = render_pdf(output)

    green = pixel_at(pixmap, 10, 5)

    assert green[1] > 150
    assert green[0] < 100
    assert green[2] < 100


def test_missing_artwork_path_raises_error(tmp_path):
    sticker = box(0, 0, 20, 10)
    placed = box(10, 10, 30, 20)

    output = tmp_path / "stickers.pdf"

    with pytest.raises(ValueError, match="No SVG artwork"):
        save_pdf(
            [(sticker, placed)],
            {},
            output,
        )


def test_nonexistent_svg_file_raises_error(tmp_path):
    sticker = box(0, 0, 20, 10)
    placed = box(10, 10, 30, 20)

    output = tmp_path / "stickers.pdf"

    with pytest.raises(FileNotFoundError):
        save_pdf(
            [(sticker, placed)],
            {id(sticker): tmp_path / "missing.svg"},
            output,
        )

def test_pdf_uses_sticker_model_svg_path(tmp_path):
    geometry = box(0,0,20,10)
    placed = box(100,100,120,110)

    artwork = make_svg(tmp_path / "sticker.svg")

    sticker = Sticker(
        id="test-001",
        name="test Sticker",
        size = 200,
        description = "A test sticker",
        svg_path = str(artwork),
    )

    output = tmp_path / "stickers.pdf"

    save_pdf(
        [(geometry, placed)],
        {id(geometry): sticker},
        output,
    )
    assert output.exists()
    assert output.stat().st_size >0 