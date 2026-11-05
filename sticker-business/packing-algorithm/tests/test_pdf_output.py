from pathlib import Path

import pytest
from pypdf import PdfReader
from shapely.geometry import box

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