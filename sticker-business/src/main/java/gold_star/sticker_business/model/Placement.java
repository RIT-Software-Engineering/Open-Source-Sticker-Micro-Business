package gold_star.sticker_business.model;

import java.util.Objects;

public final class Placement {

  private final int id;
  private final Sticker sticker;
  private final double x;
  private final double y;
  private final double rotation;

  public Placement(int id, Sticker sticker, double x, double y, double rotation) {
    this.id = id;
    this.sticker = sticker;
    this.x = x;
    this.y = y;
    this.rotation = rotation;
  }

  public int getId() {
    return id;
  }

  public Sticker getSticker() {
    return sticker;
  }

  public double getX() {
    return x;
  }

  public double getY() {
    return y;
  }

  public double getRotation() {
    return rotation;
  }

  @Override
  public boolean equals(Object object) {
    if (this == object) {
      return true;
    }
    if (!(object instanceof Placement placement)) {
      return false;
    }
    return id == placement.id
        && Double.compare(x, placement.x) == 0
        && Double.compare(y, placement.y) == 0
        && Double.compare(rotation, placement.rotation) == 0
        && Objects.equals(sticker, placement.sticker);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, sticker, x, y, rotation);
  }

  @Override
  public String toString() {
    return "Placement{"
        + "id="
        + id
        + ", sticker="
        + sticker
        + ", x="
        + x
        + ", y="
        + y
        + ", rotation="
        + rotation
        + '}';
  }
}
