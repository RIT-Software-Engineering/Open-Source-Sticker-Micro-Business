package gold_star.sticker_business.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "PermissionType")
public class PermissionType {
  @Id @GeneratedValue private int id;

  private String name;

  @OneToMany(mappedBy = "permissionType")
  private List<Permission> permissions = new ArrayList<>();

  public PermissionType() {}

  public PermissionType(String name) {
    this.name = name;
  }

  public int getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public List<Permission> getPermissions() {
    return permissions;
  }
}
