package gold_star.sticker_business.model;

public class Account {
  private final Long id;
  private final String email;
  private final Permission role;
  private final Cart cart;

  public Account(Long id, String email, Permission role) {
    this.id = id;
    this.email = email;
    this.role = role;
  }

  public Long getId() {
    return id;
  }

  public String getEmail() {
    return email;
  }

  public Permission getRole() {
    return role;
  }
}
