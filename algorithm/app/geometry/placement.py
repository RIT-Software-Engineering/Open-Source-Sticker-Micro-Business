from shapely.affinity import rotate, translate

def place_sticker(geometry, x, y, rotation_degrees=0):
    """Rotate a sticker and place its bounding box at (x,y)"""
    placed = rotate(
        geometry, 
        rotation_degrees,
        origin="centroid",
    )

    min_x, min_y, _, _ = placed.bounds

    return translate(
        placed,
        xoff=x - min_x,
        yoff = y- min_y,
    )

def stickers_overlap(first,second):
    """Return whether two stickers overlap in their interiors"""
    return first.intersection(second).area >0