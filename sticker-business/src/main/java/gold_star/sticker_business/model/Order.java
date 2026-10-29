package gold_star.sticker_business.model;

import java.sql.Timestamp;
import java.util.List;

public class Order {

  private final int id;
  private final int customerId;
  private final Timestamp placementTimestamp;
  private final OrderStatus status;
  private final List<OrderItem> items;

  public Order(
      int id,
      int customerId,
      Timestamp placementTimestamp,
      OrderStatus status,
      List<OrderItem> items) {
    this.id = id;
    this.customerId = customerId;
    this.placementTimestamp = placementTimestamp;
    this.status = status;
    this.items = items;
  }

  public int getId() {
    return id;
  }

  public int getCustomerId() {
    return customerId;
  }

  public Timestamp getPlacementTimestamp() {
    return placementTimestamp;
  }

  public OrderStatus getStatus() {
    return status;
  }

  public List<OrderItem> getItems() {
    return items;
  }
}
