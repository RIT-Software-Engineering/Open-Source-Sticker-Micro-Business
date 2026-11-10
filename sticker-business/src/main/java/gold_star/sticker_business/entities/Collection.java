package entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Collection")
public class Collection {
  @Id @GeneratedValue private int id;

  private String name;

  // Reference to all the CollectionItems in the order
  @OneToMany(mappedBy = "collectionId", cascade = CascadeType.ALL)
  private List<CollectionItems> items = new ArrayList<CollectionItems>();

  public Collection() {}

  public Collection(String name) {
    this.name = name;
  }

  public String getName() {
    return this.name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
