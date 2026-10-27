from shapely.geometry import box
from app.packing.semi_greedy import pack_stickers_semi_greedy
from app.visualization.preview import save_packing_preview

page = box(0, 0, 100, 100)

stickers = [
    box(0, 0, 20, 10),
    box(0, 0, 15, 15),
    box(0, 0, 10, 25),
]

placements = pack_stickers_semi_greedy(stickers, page, seed=42)

save_packing_preview(
    page,
    placements,
    "output/packing_preview.svg",
)