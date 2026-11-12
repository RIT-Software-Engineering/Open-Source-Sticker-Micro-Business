from dataclasses import dataclass,field
# from shapely.geometry import Polygon

@dataclass
class Sticker:
    """Catalog metadata and file refs for one sticker."""
    id:str
    name:str
    size:float
    description:str
    tags:list[str] = field(default_factory=list)
    category:str=""
    hpgl_path:str=""
    svg_path:str=""