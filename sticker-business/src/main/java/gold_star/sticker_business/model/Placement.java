package gold_star.sticker_business.model;

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
}
