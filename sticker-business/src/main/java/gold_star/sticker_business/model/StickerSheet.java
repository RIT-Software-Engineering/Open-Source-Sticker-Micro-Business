package gold_star.sticker_business.model;

public class StickerSheet {

  private final int id;
  private final double price;
  private final String pdf;
  private final String hpgl;
  private final double width;
  private final double height;

  public StickerSheet(int id, double price, String pdf, String hpgl, double width, double height) {
    this.id = id;
    this.price = price;
    this.pdf = pdf;
    this.hpgl = hpgl;
    this.width = width;
    this.height = height;
  }

  public int getId() {
    return id;
  }

  public double getPrice() {
    return price;
  }

  public String getPdf() {
    return pdf;
  }

  public String getHpgl() {
    return hpgl;
  }

  public double getWidth() {
    return width;
  }

  public double getHeight() {
    return height;
  }
}
