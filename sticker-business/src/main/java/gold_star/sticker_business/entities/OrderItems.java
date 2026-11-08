package entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "OrderItems")
public class OrderItems {
  @Id @GeneratedValue private int id;

  @ManyToOne private int orderId;
  private int sheetId;
  private int quantity;

  public OrderItems() {}
}
