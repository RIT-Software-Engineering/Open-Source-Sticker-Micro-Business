package gold_star.sticker_business.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@SuppressWarnings("NullAway.Init")
@Entity
@Table(name = "OrderItemsStatus")
public class OrderItemsStatus {
  @Id @GeneratedValue private int id;

  // fk to OrderItems table
  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "orderItemsId", foreignKey = @ForeignKey(name = "ORDER_ITEMS_ID_FK"))
  private OrderItems orderItem;

  private boolean complete;

  public OrderItemsStatus() {}

  public OrderItemsStatus(OrderItems orderItem, boolean complete) {
    this.orderItem = orderItem;
    this.complete = complete;
  }

  public int getId() {
    return this.id;
  }

  public OrderItems getOrderItem() {
    return this.orderItem;
  }

  public boolean getComplete() {
    return this.complete;
  }

  public void setComplete(boolean complete) {
    this.complete = complete;
  }
}
