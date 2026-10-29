package gold_star.sticker_business.model;

public class StickerSelection {

  private final int id;
  private final Sticker sticker;
  private final int quantity;

  public StickerSelection(int id, Sticker sticker, int quantity) {
    this.id = id;
    this.sticker = sticker;
    this.quantity = quantity;
  }

  public int getId() {
    return id;
  }

  public Sticker getSticker() {
    return sticker;
  }

  public int getQuantity() {
    return quantity;
  }
}
