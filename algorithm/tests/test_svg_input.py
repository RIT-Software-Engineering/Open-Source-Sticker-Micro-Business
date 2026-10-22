from app.svg.loader import load_sticker_svg

from pathlib import Path
import pytest

FIXTURES = Path(__file__).parent / "fixtures"

def test_svg_loads_as_one_nonempty_sticker():
    geometry = load_sticker_svg(
        FIXTURES / "tetrispieceI.svg"
    )

    assert not geometry.is_empty
    assert geometry.is_valid
    assert geometry.area > 0

    min_x, min_y, max_x, max_y = geometry.bounds
    assert max_x > min_x
    assert max_y > min_y

def test_svg_without_usable_geometry_is_rejected(tmp_path):
    empty_svg = tmp_path / "empty.svg"
    empty_svg.write_text(
        '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
        encoding="utf-8",
    )

    with pytest.raises(ValueError, match="No usable sticker geometry"):
        load_sticker_svg(empty_svg)

def test_missing_svg_file_is_rejected(tmp_path):
    missing_svg = tmp_path / "missing.svg"

    with pytest.raises(FileNotFoundError):
        load_sticker_svg(missing_svg)