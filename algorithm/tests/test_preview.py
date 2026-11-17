from shapely.geometry import box

from app.visualization.preview import save_packing_preview

def test_preview_creates_svg_file(tmp_path):
    page = box(0,0,100,100)
    sticker = box(10,20,30,40)
    output = tmp_path/"preview.svg"

    save_packing_preview(
        page,
        [(sticker,sticker)],
        output,
    )

    assert output.exists()

    svg = output.read_text()
    assert "<svg" in svg
    assert "<rect" in svg
    assert "<path" in svg

def test_preview_handles_empty_packing(tmp_path):
    page = box(0,0,100,50)
    output = tmp_path / "empty.svg"

    save_packing_preview(page, [], output)

    assert output.exists()
    assert "<svg" in output.read_text()