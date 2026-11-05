package gold_star.sticker_business.model;

import java.util.Objects;

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

  @Override
  public boolean equals(Object object) {
    if (this == object) {
      return true;
    }
    if (!(object instanceof StickerSheet that)) {
      return false;
    }
    return id == that.id
        && Double.compare(price, that.price) == 0
        && Double.compare(width, that.width) == 0
        && Double.compare(height, that.height) == 0
        && Objects.equals(pdf, that.pdf)
        && Objects.equals(hpgl, that.hpgl);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, price, pdf, hpgl, width, height);
  }

  @Override
  public String toString() {
    return "StickerSheet{"
        + "id="
        + id
        + ", price="
        + price
        + ", pdf='"
        + pdf
        + '\''
        + ", hpgl='"
        + hpgl
        + '\''
        + ", width="
        + width
        + ", height="
        + height
        + '}';
  }
}
