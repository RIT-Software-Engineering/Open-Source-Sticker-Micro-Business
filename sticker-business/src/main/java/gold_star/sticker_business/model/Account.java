package gold_star.sticker_business.model;

import java.util.Objects;

public class Account {
  private final Long id;
  private final String email;
  private final Permission role;

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

  @Override
  public boolean equals(Object object) {
    if (this == object) {
      return true;
    }
    if (!(object instanceof Account account)) {
      return false;
    }
    return Objects.equals(id, account.id)
        && Objects.equals(email, account.email)
        && Objects.equals(role, account.role);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, email, role);
  }

  @Override
  public String toString() {
    return "Account{" + "id=" + id + ", email='" + email + '\'' + ", role=" + role + '}';
  }
}
