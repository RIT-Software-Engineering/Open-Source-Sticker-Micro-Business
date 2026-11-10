package entities;

import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "OrderItems")
public class OrderItems {
  @Id @GeneratedValue private int id;

  @ManyToOne // fk to PlacedOrder table
  @JoinColumn(name = "orderId", foreignKey = @ForeignKey(name = "ORDER_ID_FK"))
  private Order order;

  private int sheetId;
  private int quantity;

  public OrderItems() {}
}
