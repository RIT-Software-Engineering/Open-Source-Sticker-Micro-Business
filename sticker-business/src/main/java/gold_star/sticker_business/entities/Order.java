package entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "PlacedOrder") // 'order' is a reserved keyword in MySQL
public class Order {
  @Id @GeneratedValue private int id;

  @ManyToOne
  @JoinColumn(name = "customerId")
  private int customerId; // FK to User --> TODO: change type to User when class exists

  @CreationTimestamp private Instant placementTimestamp;

  @Enumerated(EnumType.STRING)
  private OrderStatus status;

  private String address; // json?? maybe use a blob instead?

  // Reference to all the OrderItems in the order
  @OneToMany(mappedBy = "orderId", cascade = CascadeType.ALL)
  private List<OrderItems> items = new ArrayList<OrderItems>();

  public Order() {}

  public Order(int customerId, String address) {
    this.customerId = customerId;
    this.address = address;
  }
}
