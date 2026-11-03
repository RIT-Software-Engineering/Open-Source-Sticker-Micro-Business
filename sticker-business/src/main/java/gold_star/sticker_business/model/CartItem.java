package gold_star.sticker_business.model;

import java.util.Objects;

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

  @Override
  public boolean equals(Object object) {
    if (this == object) {
      return true;
    }
    if (!(object instanceof CartItem cartItem)) {
      return false;
    }
    return id == cartItem.id
        && quantity == cartItem.quantity
        && Objects.equals(stickerSheet, cartItem.stickerSheet);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, stickerSheet, quantity);
  }

  @Override
  public String toString() {
    return "CartItem{"
        + "id="
        + id
        + ", stickerSheet="
        + stickerSheet
        + ", quantity="
        + quantity
        + '}';
  }
}
