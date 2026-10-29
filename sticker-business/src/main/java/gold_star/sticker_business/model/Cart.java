package gold_star.sticker_business.model;

import java.util.List;

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
}
