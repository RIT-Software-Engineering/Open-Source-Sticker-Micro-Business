import pytest
from shapely.geometry import box
from app.packing.greedy import pack_stickers

from app.packing.semi_greedy import pack_stickers_semi_greedy

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


#post-greedy development tests
def test_rotates_sticker_when_needed():
    sticker = box(0,0,10,5)
    page = box(0,0,5,10)

    placements = pack_stickers_semi_greedy([sticker],page)

    assert len(placements)==1
    assert page.covers(placements[0][1])

def test_places_large_sticker_before_small_sticker():
    small = box(0,0,2,2)
    large = box(0,0,8,8)
    page = box(0,0,10,10)

    placements = pack_stickers_semi_greedy([small,large], page)

    #both should fit, but the large sticker should be placed first at [0][0]
    assert len(placements) == 2
    assert placements[0][0] is large

#purely semi greedy tests

def test_semi_greedy_packs_a_sticker():
    sticker = box(0,0,5,5)
    page = box(0,0,10,10)

    placements = pack_stickers_semi_greedy(
        [sticker], page, seed=42
    )

    assert len(placements) == 1
    assert page.covers(placements[0][1])

