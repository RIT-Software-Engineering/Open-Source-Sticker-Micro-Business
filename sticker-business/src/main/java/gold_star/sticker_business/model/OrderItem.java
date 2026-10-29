package gold_star.sticker_business.model;

public class OrderItem {

  private final int id;
  private final int quantity;
  private final StickerSheet sheet;

  public OrderItem(int id, int quantity, StickerSheet sheet) {
    this.id = id;
    this.quantity = quantity;
    this.sheet = sheet;
  }

  public int getId() {
    return id;
  }

  public int getQuantity() {
    return quantity;
  }

  public StickerSheet getSheet() {
    return sheet;
  }
}
