package gold_star.sticker_business.model;

import java.sql.Timestamp;
import java.util.List;
import java.util.Objects;

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

  @Override
  public boolean equals(Object object) {
    if (this == object) {
      return true;
    }
    if (!(object instanceof Order order)) {
      return false;
    }
    return id == order.id
        && customerId == order.customerId
        && Objects.equals(placementTimestamp, order.placementTimestamp)
        && status == order.status
        && Objects.equals(items, order.items);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, customerId, placementTimestamp, status, items);
  }

  @Override
  public String toString() {
    return "Order{"
        + "id="
        + id
        + ", customerId="
        + customerId
        + ", placementTimestamp="
        + placementTimestamp
        + ", status="
        + status
        + ", items="
        + items
        + '}';
  }
}
