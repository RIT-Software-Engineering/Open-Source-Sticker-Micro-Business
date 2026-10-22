from pathlib import Path
import xml.etree.ElementTree as ET

from shapely.geometry import Polygon
from shapely.ops import unary_union
from svgpathtools import parse_path

def _local_tag(element):
    """Return an SVG element's tag without the XML namespace, for testing/parsing."""
    return element.tag.rsplit("}",1)[-1]

def _simple_path(path_data,samples_per_curve=12):
    """Convert an SVG path into sampled coordinate pairs."""
    path = parse_path(path_data)

    if not path.isclosed():
        return None
    
    points = []

    for segment in path:
        start = segment.start
        if not points:
            points.append((start.real, start.imag))

        # sampling handles lines and curves with the same interface
        for i in range(1, samples_per_curve+1):
            point = segment.point(i/samples_per_curve)
            points.append((point.real, point.imag))

    if len(points) < 4:
        return None

    return points

def _parse_points(points_text):
    """"""