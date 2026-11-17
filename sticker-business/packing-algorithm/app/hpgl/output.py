from pathlib import  Path

def save_hpgl(
        placements,
        output,
        units_per_unit=1,
        offset=(0,0),
):
    """Export sticker polygons as HPGL paths"""
    output = Path(output)

    offset_x, offset_y = offset
    commands = [
        "IN;",
        "PA;",
        "SP1;",
    ]

    def plot_point(x,y):
        plot_x = round((x + offset_x) * units_per_unit)
        plot_y = round((y+offset_y) * units_per_unit)
        return plot_x, plot_y

    for _, geometry in placements:
        if geometry.geom_type != "Polygon":
            raise ValueError(
                "Each sticker must be a single Polygon"
            )

        coordinates = list(geometry.exterior.coords)
        if len(coordinates) < 4:
            raise ValueError(
                "Sticker outline must contain at least three points"
            )

        points = [plot_point(x,y) for x,y in coordinates]

        # go to starting point with pen raised
        start_x, start_y = points[0]
        commands.append(f"PU{start_x},{start_y};")

        #lower pen
        remaining_points = points[1:-1]
        coordinate_data = ",".join(
            f"{x},{y}" for x,y in remaining_points
        )

        commands.append(f"PD{coordinate_data};")
        commands.append("PU;")

    commands.append("SP0;")

    output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text("\n".join(commands), encoding="ascii")
