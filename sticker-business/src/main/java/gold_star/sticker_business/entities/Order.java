package entities;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "PlacedOrder") // 'order' is a reserved keyword in MySQL
public class Order {
  @Id @GeneratedValue private int id;

  @ManyToOne private int customer_id; // FK to User
  @CreationTimestamp private Instant placementTimestamp;

  @Enumerated(EnumType.STRING)
  private OrderStatus status;

  private String address; // json?? maybe use a blob instead?

  public Order() {}

  public Order(int customer_id, String address) {
    this.customer_id = customer_id;
    this.address = address;
  }
}
