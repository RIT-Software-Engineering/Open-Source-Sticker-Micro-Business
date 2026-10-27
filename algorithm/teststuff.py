from pathlib import Path
from shapely.geometry import box

from app.svg.loader import load_sticker_svg
from app.packing.semi_greedy import pack_stickers_semi_greedy
from app.visualization.preview import save_packing_preview

fixtures = Path("tests/fixtures")
page = box(0, 0, 250, 180)


stickers = []
# stickers = [
#     load_sticker_svg(path)
#     for path in sorted(fixtures.glob("*.svg"))
# ]

for path in sorted(fixtures.glob("*.svg")):
    print(f"Loading {path.name}...")

    #each svg is ONE sticker, try to merge paths to make one silhouette
    geometry = load_sticker_svg(path,merge_tolerance=8)

    if geometry.geom_type != "Polygon":
        raise ValueError(
            f"{path.name} did not produce one polygon:"
            f"{geometry.geom_type}"
        )

    if len(geometry.interiors) > 0:
        raise ValueError(
            f"{path.name} contains interior outlines."
        )

    stickers.append(geometry)

placements = pack_stickers_semi_greedy(stickers, page, seed=42)

save_packing_preview(
    page,
    placements,
    "output/packing_preview.svg",
)

print(f"\nLoaded {len(stickers)} stickers.")
print(f"Placed {len(placements)} stickers.")
print(f"Skipped {len(stickers) - len(placements)} stickers.")
print(f"Preview saved to output/packing_preview.svg")