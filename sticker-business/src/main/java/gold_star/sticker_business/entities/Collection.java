package entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
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

  @Column(unique = true)
  private String name;

  // Reference to all the CollectionItems in the order
  // No setter -- stickers in a collection should not be modified this way
  @OneToMany(mappedBy = "collectionId", cascade = CascadeType.ALL)
  private List<CollectionItems> items = new ArrayList<CollectionItems>();

  public Collection() {}

  public Collection(String name) {
    this.name = name;
  }

  public String getName() {
    return this.name;
  }

  public List<CollectionItems> getItems() {
    return this.items;
  }

  public void setName(String name) {
    this.name = name;
  }
}
