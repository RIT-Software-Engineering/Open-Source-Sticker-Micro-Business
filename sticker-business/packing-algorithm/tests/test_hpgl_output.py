from shapely.geometry import box
from app.hpgl.output import save_hpgl

def test_writes_a_closed_sticker_outline(tmp_path):
    sticker = box(0,0,10,5)
    output = tmp_path/"test.plt"

    save_hpgl(
        [(sticker,sticker)],
        output,
        units_per_unit=1,
    )

    content = output.read_text()

    assert "IN;" in content
    assert "PA;" in content
    assert "SP1;" in content
    assert "PU10,0;" in content
    assert "PD10,5,0,5,0,0;" in content
    assert "PU;" in content
    assert "SP0;" in content

def test_scales_coordinates(tmp_path):
    sticker = box(0,0,10,5)
    output = tmp_path / "scaled.plt"

    save_hpgl(
        [(sticker,sticker)],
        output,
        units_per_unit = 10,
    )

    content = output.read_text()

    assert "PU100,0;" in content
    assert "PD100,50,0,50,0,0;" in content

def test_applies_coordinate_offset(tmp_path):
    sticker = box(0,0,10,5)
    output = tmp_path / "offset.plt"

    save_hpgl(
        [(sticker,sticker)],
        output,
        units_per_unit = 1,
        offset = (20,30),
    )

    content = output.read_text()

    assert "PU30,30;" in content
    assert "PD30,35,20,35,20,30;" in content

def test_lifts_pen_between_stickers(tmp_path):
    first = box(0, 0, 10, 10)
    second = box(20, 0, 30, 10)
    output = tmp_path / "multiple.plt"

    save_hpgl(
        [(first, first), (second, second)],
        output,
        units_per_unit=1,
    )

    content = output.read_text()

    assert content.count("PU;") == 2
    assert content.count("PD") == 2