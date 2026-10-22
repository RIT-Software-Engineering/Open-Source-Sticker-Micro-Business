from app.svg.loader import load_sticker_svg
from shapely.geometry import Polygon
from pathlib import Path
import pytest

FIXTURES = Path(__file__).parent / "fixtures"

def test_svg_loads_as_one_nonempty_sticker():
    geometry = load_sticker_svg(
        FIXTURES/"tetrispieceI.svg"
    )

    assert not geometry.is_empty
    assert geometry.is_valid
    assert geometry.geom_type == "Polygon"
    assert geometry.area > 0
    assert len(geometry.interiors) == 0

def test_multiple_touching_blocks_form_one_outline(tmp_path):
    svg = tmp_path / "two_blocks.svg"
    svg.write_text(
        """
        <svg xmlns="http://www.w3.org/2000/svg">
          <path d="
            M 0 0 L 10 0 L 10 10 L 0 10 Z
            M 10 0 L 20 0 L 20 10 L 10 10 Z
          "/>
        </svg>
        """,
        encoding="utf-8",
    )

    geometry = load_sticker_svg(svg)

    assert geometry.geom_type == "Polygon"
    assert geometry.area == pytest.approx(200)
    assert geometry.bounds == (0,0,20,10)
    assert len(geometry.interiors) == 0

def test_disconnected_blocks_can_be_merged_with_tolerance(tmp_path):
    svg = tmp_path / "gapped_blocks.svg"
    svg.write_text(
        """
        <svg xmlns="http://www.w3.org/2000/svg">
          <path d="
            M 0 0 L 10 0 L 10 10 L 0 10 Z
            M 12 0 L 22 0 L 22 10 L 12 10 Z
          "/>
        </svg>
        """,
        encoding="utf-8",
    )

    geometry = load_sticker_svg(svg, merge_tolerance=1.1)

    assert geometry.geom_type == "Polygon"
    assert geometry.bounds == (0, 0, 22, 10)
    assert len(geometry.interiors) == 0

def test_missing_svg_file_is_rejected(tmp_path):
    missing_svg = tmp_path / "missing.svg"

    with pytest.raises(FileNotFoundError):
        load_sticker_svg(missing_svg)