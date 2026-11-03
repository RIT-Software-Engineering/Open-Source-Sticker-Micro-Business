package gold_star.sticker_business.model;

import java.util.Objects;

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

  @Override
  public boolean equals(Object object) {
    if (this == object) {
      return true;
    }
    if (!(object instanceof OrderItem orderItem)) {
      return false;
    }
    return id == orderItem.id
        && quantity == orderItem.quantity
        && Objects.equals(sheet, orderItem.sheet);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, quantity, sheet);
  }

  @Override
  public String toString() {
    return "OrderItem{" + "id=" + id + ", quantity=" + quantity + ", sheet=" + sheet + '}';
  }
}
