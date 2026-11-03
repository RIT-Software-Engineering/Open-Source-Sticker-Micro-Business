package gold_star.sticker_business.model;

import java.util.Objects;

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

  @Override
  public boolean equals(Object object) {
    if (this == object) {
      return true;
    }
    if (!(object instanceof StickerSelection that)) {
      return false;
    }
    return id == that.id && quantity == that.quantity && Objects.equals(sticker, that.sticker);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, sticker, quantity);
  }

  @Override
  public String toString() {
    return "StickerSelection{"
        + "id="
        + id
        + ", sticker="
        + sticker
        + ", quantity="
        + quantity
        + '}';
  }
}
