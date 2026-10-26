from app.geometry.placement import (
    fits_on_page,
    place_sticker,
    stickers_overlap,
)

def pack_stickers(stickers,page):
    """Place stickers at the first valid position (super greedy)"""
    placements = []
    min_x,min_y,max_x,max_y = page.bounds

    # use smallest sticker dimension
    dimensions = [
        min(sticker.bounds[2] - sticker.bounds[0],
            sticker.bounds[3] - sticker.bounds[1])
        for sticker in stickers
        if not sticker.is_empty
    ]

    if not dimensions:
        return placements

    step = min(dimensions)
    if step <= 0:
        return placements

    y = min_y
    while y < max_y:
        x = min_x
        while x < max_x:
            for sticker in stickers:
                if any(original is sticker for original, _ in placements):
                    continue

                placed = place_sticker(sticker, x, y)

                if not fits_on_page(placed,page):
                    continue

                if any(
                    stickers_overlap(placed,existing)
                    for _, existing in placements
                ):
                    continue

                placements.append((sticker, placed))

            x+= step
        y += step
    return placements