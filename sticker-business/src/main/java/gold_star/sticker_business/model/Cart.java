package gold_star.sticker_business.model;

import java.util.List;
import java.util.Objects;

public class Cart {

  private final int id;
  private final List<CartItem> sheets;
  private final Account account;

  public Cart(int id, List<CartItem> sheets, Account account) {
    this.id = id;
    this.sheets = sheets;
    this.account = account;
  }

  public int getId() {
    return id;
  }

  public List<CartItem> getSheets() {
    return sheets;
  }

  public Account getAccount() {
    return account;
  }

  @Override
  public boolean equals(Object object) {
    if (this == object) {
      return true;
    }
    if (!(object instanceof Cart cart)) {
      return false;
    }
    return id == cart.id
        && Objects.equals(sheets, cart.sheets)
        && Objects.equals(account, cart.account);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, sheets, account);
  }

  @Override
  public String toString() {
    return "Cart{" + "id=" + id + ", sheets=" + sheets + ", account=" + account + '}';
  }
}
