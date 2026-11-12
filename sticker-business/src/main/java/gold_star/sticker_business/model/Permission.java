package gold_star.sticker_business.model;

public class Permission {

  @Override
  public boolean equals(Object object) {
    return object instanceof Permission;
  }

  @Override
  public int hashCode() {
    return Permission.class.hashCode();
  }

  @Override
  public String toString() {
    return "Permission{}";
  }
}
