from app.packing.greedy import pack_stickers
import random

from app.geometry.placement import (
    fits_on_page,
    place_sticker,
    stickers_overlap,
)


def pack_stickers_semi_greedy(stickers, page, seed=None):
    """Pack stickers by randomly choosing among the best candidates, including rotation"""
    rng = random.Random(seed)

    remaining = sorted(
        stickers,
        key=lambda s: (
            (s.bounds[2] - s.bounds[0])
            * (s.bounds[3] - s.bounds[1])
        ),
        reverse=True,
    )

    min_x, min_y, _,_ = page.bounds
    placements = []

    for sticker in remaining:
        positions = {(min_x,min_y)}

        for _, placed in placements:
            left, bottom, right, top = placed.bounds
            positions.add((right, bottom))
            positions.add((left,top))

        candidates = []

        for x, y in positions:
            for angle in (0,90,180,270):
                candidate = place_sticker(
                    sticker,
                    x,
                    y,
                    rotation_degrees=angle,
                )

                if not fits_on_page(candidate,page):
                    continue
                if any(
                    stickers_overlap(candidate, existing)
                    for _, existing in placements
                ):
                    continue

                _, bottom, right, top = candidate.bounds
                score = (top,right,bottom, x,y, angle)
                candidates.append((score, candidate))
        if candidates:
            candidates.sort(key=lambda item: item[0])

            #choose randomly from 3 (variable) best valid candidates
            shortlist = candidates[:3]
            _, chosen = rng.choice(shortlist)
            placements.append((sticker,chosen))
    return placements