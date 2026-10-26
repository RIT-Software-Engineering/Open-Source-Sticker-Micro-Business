import pytest
from shapely.geometry import box
from app.geometry.placement import place_sticker, stickers_overlap

def test_placement_moves_sticker_to_requested_position():
    sticker = box(0,0,10,5)
    placed = place_sticker(sticker, x=20, y=30)
    assert placed.bounds == pytest.approx((20,30,30,35))
    assert placed.area == pytest.approx(sticker.area)

def test_rotation_preserves_area_and_swaps_bounds_at_90_degrees():
    sticker = box(0,0,10,5)
    placed = place_sticker(
        sticker,
        x=0,
        y=0,
        rotation_degreese=90,
    )

    min_x,min_y,max_x,max_y = placed.bounds

    assert max_x - min_x == pytest.approx(5)
    assert max_y - min_y == pytest.approx(10)
    assert placed.area == pytest.approx(sticker.area)

def test_overlapping_stickers_are_detected():
    first = box(0,0,10,10)
    second = box(5,5,15,15)
    assert stickers_overlap(first, second)

def test_stickers_that_only_touch_edges_do_not_overlap():
    first = box(0,0,10,10)
    second = box(10,0,20,10)
    assert not stickers_overlap(first, second)

def test_seperate_stickers_do_not_overlap():
    first = box(0,0,10,10)
    second = box(20,20,30,30)
    assert not stickers_overlap(first,second)