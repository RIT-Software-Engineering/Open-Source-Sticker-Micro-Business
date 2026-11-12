package gold_star.sticker_business.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Convert;
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
import java.util.HashMap;
import java.util.List;
import org.hibernate.annotations.CreationTimestamp;

@SuppressWarnings("NullAway.Init")
@Entity
@Table(name = "PlacedOrder") // 'order' is a reserved keyword in MySQL
public class Order {
  @Id @GeneratedValue private int id;

  @ManyToOne
  @JoinColumn(name = "customerId")
  private User customer;

  @CreationTimestamp private Instant placementTimestamp;

  @Enumerated(EnumType.STRING)
  private OrderStatus status;

  private String addressJSON;

  private String note;

  // Reference to all the OrderItems in the order
  @OneToMany(mappedBy = "orderId", cascade = CascadeType.ALL)
  private List<OrderItems> items = new ArrayList<OrderItems>();

  // Reference to all the OrderUpdates for the order
  @OneToMany(mappedBy = "orderId", cascade = CascadeType.ALL)
  private List<OrderUpdates> updates = new ArrayList<OrderUpdates>();

  @Convert(converter = AddressConverter.class)
  private HashMap<String, String> address;

  public Order() {}

  public Order(User customer, String addressJSON) {
    this.customer = customer;
    this.addressJSON = addressJSON;
  }

  public int getId() {
    return this.id;
  }

  public User getCustomer() {
    return this.customer;
  }

  public Instant getPlacementTimestamp() {
    return this.placementTimestamp;
  }

  public OrderStatus getStatus() {
    return this.status;
  }

  public HashMap<String, String> getAddress() {
    return this.address;
  }

  public String getNote() {
    return this.note;
  }

  public void setStatus(OrderStatus status) {
    this.status = status;
  }

  public void setNote(String note) {
    this.note = note;
  }
}
