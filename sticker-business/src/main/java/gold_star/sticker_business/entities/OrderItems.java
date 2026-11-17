package gold_star.sticker_business.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@SuppressWarnings("NullAway.Init")
@Entity
@Table(name = "OrderItems")
public class OrderItems {
  @Id @GeneratedValue private int id;

  @ManyToOne // fk to PlacedOrder table
  @JoinColumn(name = "orderId", foreignKey = @ForeignKey(name = "ORDER_ID_FK"))
  private Order order;

  private StickerSheets sheet;
  private int quantity;

  public OrderItems() {}

  public OrderItems(Order order, StickerSheets sheet, int quantity) {
    this.order = order;
    this.sheet = sheet;
    this.quantity = quantity;
  }

  public int getId() {
    return this.id;
  }

  public Order getOrder() {
    return this.order;
  }

  public StickerSheets getSheet() {
    return this.sheet;
  }

  public int getQuantity() {
    return this.quantity;
  }

  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }
}
