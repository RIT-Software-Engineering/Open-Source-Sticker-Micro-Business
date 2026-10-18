from pathlib import Path
import pytest
from app.svg.loader import load_sticker_svg

FIXTURES = Path(__file__).parent / "fixtures"

def test_svg_loads_as_one_nonempty_sticker():
    sticker = load_sticker_svg(
        FIXTURES / "tetrispieceI.svg"
    )

    assert sticker is not None
    assert not sticker.geometry.is_empty
    assert sticker.geometry.is_valid
    assert sticker.geometry.area > 0
    assert sticker.width > 0
    assert sticker.height > 0

def test_empty_svg_is_rejected():
    with pytest.raises(
        ValueError,
        match = "no usable sticker geometry",
    ):
        load_sticker_svg(
            FIXTURES / "tetrispiecesL.svg"
        )
        