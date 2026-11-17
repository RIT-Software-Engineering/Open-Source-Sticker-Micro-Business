package gold_star.sticker_business.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@SuppressWarnings("NullAway.Init")
@Table(name = "PermissionType")
public class PermissionType {
  @Id @GeneratedValue private int id;

  @Column(unique = true)
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
