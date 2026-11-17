from shapely.geometry import Polygon
from app.models.sticker import Sticker

def test_sticker_stores_catalog_properties():
    sticker = Sticker(
        id="tetris-i",
        name="Tetris I Block",
        size=100.0,
        description="A straight Tetris-style sticker.",
        tags=["tetris","block","geometric"],
        category = "Tetris Blocks",
        hpgl_path="stickers/tetrispiecesI.hpgl",
        svg_path="stickers/tetrispiecesI.svg",
    )

    assert sticker.id == "tetris-i"
    assert sticker.name == "Tetris I Block"
    assert sticker.size==100.0
    assert sticker.description=="A straight Tetris-style sticker."
    assert sticker.tags==["tetris","block","geometric"]
    assert sticker.category == "Tetris Blocks"
    assert sticker.hpgl_path=="stickers/tetrispiecesI.hpgl"
    assert sticker.svg_path=="stickers/tetrispiecesI.svg"

def test_stickers_can_have_independent_tag_lists():
    first = Sticker(
        id="sticker-a",
        name="Sticker A",
        size = 10.0,
        description = "First sticker.",
        tags = ["test"],
        category = "Tests",
        hpgl_path="a.hpgl",
        svg_path="a.svg",
    )

    second = Sticker(
        id="sticker-b",
        name="Sticker B",
        size = 20.0,
        description = "Second sticker.",
        tags = ["example"],
        category = "Examples",
        hpgl_path="b.hpgl",
        svg_path="b.svg",
    )

    first.tags.append("extra")

    assert first.tags == ["test","extra"]
    assert second.tags == ["example"]