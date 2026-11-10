package gold_star.sticker_business.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Permission")
public class Permission {
  @Id @GeneratedValue private int id;

  @ManyToMany(mappedBy = "permissions")
  private List<User> users = new ArrayList<>();

  @ManyToOne
  @JoinColumn(name = "permissionTypeId")
  private PermissionType permissionType;

  public Permission() {}

  public Permission(PermissionType permissionType) {
    this.permissionType = permissionType;
  }

  public int getId() {
    return id;
  }

  public List<User> getUsers() {
    return users;
  }

  public PermissionType getPermissionType() {
    return permissionType;
  }
}
