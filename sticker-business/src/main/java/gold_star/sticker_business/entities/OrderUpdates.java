package gold_star.sticker_business.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import org.hibernate.annotations.Immutable;

@Entity
@SuppressWarnings("NullAway.Init")
@Table(name = "OrderUpdates")
public class OrderUpdates {

  @Id @GeneratedValue private int id;

  @ManyToOne // fk to Order table
  @JoinColumn(name = "orderId", foreignKey = @ForeignKey(name = "ORDER_ID_FK"))
  private Order order;

  @Immutable private Instant timestamp;

  @Immutable private OrderStatus orderType;

  public OrderUpdates() {}

  public OrderUpdates(Order order, OrderStatus orderType) {
    this.order = order;
    this.orderType = orderType;
  }

  public int getId() {
    return this.id;
  }

  public Order getOrder() {
    return this.order;
  }

  public Instant getTimestamp() {
    return this.timestamp;
  }

  public OrderStatus getOrderType() {
    return this.orderType;
  }

  // No setters because this object should be immutable for historical integrity
}
