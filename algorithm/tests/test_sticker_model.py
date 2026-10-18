from shapely.geometry import Polygon
from app.models.sticker import Sticker

def test_sticker_stores_geometry_and_dimensions():
    geometry = Polygon([
        (0,0),
        (4,0),
        (4,2),
        (0,2),
    ])

    sticker = Sticker(
        sticker_id = "test-rectangle",
        geometry=geometry,
    )

    assert sticker.sticker_id == "test-rectangle"
    assert sticker.geometry.equals(geometry)
    assert sticker.width == 4
    assert sticker.height == 2
    assert sticker.area == 8
    