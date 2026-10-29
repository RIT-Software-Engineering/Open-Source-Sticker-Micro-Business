package gold_star.sticker_business.model;

public class CartItem {

  private final int id;
  private final StickerSheet stickerSheet;
  private final int quantity;

  public CartItem(int id, StickerSheet stickerSheet, int quantity) {
    this.id = id;
    this.stickerSheet = stickerSheet;
    this.quantity = quantity;
  }

  public int getId() {
    return id;
  }

  public StickerSheet getStickerSheet() {
    return stickerSheet;
  }

  public int getQuantity() {
    return quantity;
  }
}
