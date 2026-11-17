from app.svg.loader import load_sticker_svg
from app.svg.loader import load_sticker_geometry
from app.models.sticker import Sticker
from shapely.geometry import Point, Polygon
from pathlib import Path
import pytest

FIXTURES = Path(__file__).parent / "fixtures"

# Duplicated test, oops
# def test_svg_loads_as_one_nonempty_sticker():
#     geometry = load_sticker_svg(
#         FIXTURES/"tetrispieceI.svg"
#     )

#     assert not geometry.is_empty
#     assert geometry.is_valid
#     assert geometry.geom_type == "Polygon"
#     assert geometry.area > 0
#     assert len(geometry.interiors) == 0

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


def test_svg_loads_as_one_nonempty_sticker():
    geometry = load_sticker_svg(FIXTURES / "tetrispieceI.svg")

    assert not geometry.is_empty
    assert geometry.is_valid
    assert geometry.geom_type == "Polygon"
    assert geometry.area > 0

    # sticker should just have exterior
    assert len(geometry.interiors) == 0
    assert geometry.exterior.is_ring
    assert geometry.is_simple

def test_svg_y_axis_is_flipped_to_point_up(tmp_path):
    """SVG y grows downward; the rest of the app treats y as growing upward.

    The L below has its foot at the BOTTOM of the drawing. After loading,
    the foot must be at the bottom (low y) of the geometry. Otherwise the
    HPGL cut line is a mirror image of the art printed in the PDF.

    This test case was written by Claude Code.
    """
    svg = tmp_path / "l_shape.svg"
    svg.write_text(
        """
        <svg xmlns="http://www.w3.org/2000/svg"
             width="20" height="20" viewBox="0 0 20 20">
          <!-- Left bar full height, foot along the bottom:
                 X .
                 X X  -->
          <path d="M 0 0 L 10 0 L 10 10 L 20 10 L 20 20 L 0 20 Z"/>
        </svg>
        """,
        encoding="utf-8",
    )

    geometry = load_sticker_svg(svg)

    # The bottom-right of the drawing is filled (the foot)...
    assert geometry.contains(Point(15, 5))
    # ...and the top-right of the drawing is empty.
    assert not geometry.contains(Point(15, 15))

def test_svg_scales_to_database_dimensions_in_cm(tmp_path):
    svg = tmp_path / "sized_sticker.svg"
    svg.write_text(
        """
        <svg xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 0 L 100 0 L 100 50 L 0 50 Z"/>
        </svg>
        """,
        encoding="utf-8",
    )

    geometry = load_sticker_svg(
        svg,
        width_cm=4.0,
        height_cm=2.0,
    )
    min_x, min_y, max_x, max_y = geometry.bounds

    assert max_x - min_x == pytest.approx(4.0)
    assert max_y - min_y == pytest.approx(2.0)
    assert geometry.area == pytest.approx(8.0)


def test_svg_scaling_preserves_aspect_ratio(tmp_path):
    svg = tmp_path / "sized_sticker.svg"
    svg.write_text(
        """
        <svg xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 0 L 100 0 L 100 50 L 0 50 Z"/>
        </svg>
        """,
        encoding="utf-8",
    )

    geometry = load_sticker_svg(
        svg,
        width_cm=6.0,
        height_cm=3.0,
    )

    min_x, min_y, max_x, max_y = geometry.bounds

    assert (max_x - min_x) / (max_y - min_y) == pytest.approx(2.0)


def test_svg_rejects_dimensions_that_would_distort_aspect_ratio(tmp_path):
    svg = tmp_path / "sized_sticker.svg"
    svg.write_text(
        """
        <svg xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 0 L 100 0 L 100 50 L 0 50 Z"/>
        </svg>
        """,
        encoding="utf-8",
    )

    with pytest.raises(ValueError, match="aspect ratio"):
        load_sticker_svg(
            svg,
            width_cm=4.0,
            height_cm=3.0,
        )

def test_load_sticker_geometry_uses_database_dimensions(tmp_path):
    svg = tmp_path / "sticker.svg"
    svg.write_text(
        """
        <svg xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 0 L 100 0 L 100 50 L 0 50 Z"/>
        </svg>
        """,
        encoding="utf-8",
    )

    sticker = Sticker(
        id="test-001",
        name="Test Sticker",
        width_cm=4.0,
        height_cm=2.0,
        description="Test sticker",
        svg_path=str(svg),
    )

    geometry = load_sticker_geometry(sticker)

    min_x, min_y, max_x, max_y = geometry.bounds

    assert max_x - min_x == pytest.approx(4.0)
    assert max_y - min_y == pytest.approx(2.0)


def test_load_sticker_geometry_rejects_missing_svg_path():
    sticker = Sticker(
        id="test-002",
        name="Missing SVG",
        width_cm=4.0,
        height_cm=2.0,
        description="Test sticker",
    )

    with pytest.raises(ValueError, match="SVG path"):
        load_sticker_geometry(sticker)