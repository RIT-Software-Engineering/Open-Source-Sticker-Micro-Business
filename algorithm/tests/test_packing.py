import pytest
from shapely.geometry import box
from app.packing.greedy import pack_stickers

def test_packs_two_stickers_without_overlap():
    stickers = [
        box(0,0,10,10),
        box(0,0,10,10),
    ]
    page = box(0,0,20,10)

    placements = pack_stickers(stickers,page)

    assert len(placements) == 2

    first = placements[0][1]
    second = placements[1][1]

    assert page.covers(first)
    assert page.covers(second)
    assert first.intersection(second).area == pytest.approx(0)

def test_skips_sticker_that_cannot_fit():
    stickers = [
        box(0,0,20,20),
    ]
    page = box(0,0,10,10)
    placements = pack_stickers(stickers,page)
    assert placements == []

def test_returns_original_and_placed_geometry():
    sticker = box(0,0,5,5)
    page = box(0,0,10,10)
    placements = pack_stickers([sticker],page)

    assert len(placements) == 1

    original, placed = placements[0]

    assert original is sticker
    assert placed.area == pytest.approx(sticker.area)
    assert page.covers(placed)

def test_empty_input_returns_no_placements():
    page = box(0,0,100,100)
    assert pack_stickers([],page) == []