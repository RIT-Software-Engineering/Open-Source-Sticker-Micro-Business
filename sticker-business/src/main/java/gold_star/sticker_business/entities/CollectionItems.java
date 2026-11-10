package entities;

import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "CollectionItems")
public class CollectionItems {
  @Id @GeneratedValue private int id;

  @ManyToOne
  @JoinColumn(name = "stickerId", foreignKey = @ForeignKey(name = "STICKER_ID_FK"))
  private Sticker sticker;

  @ManyToOne
  @JoinColumn(name = "collectionId", foreignKey = @ForeignKey(name = "COLLECTION_ID_FK"))
  private Collection collection;

  public CollectionItems() {}

  public CollectionItems(Collection collection, Sticker sticker) {
    this.collection = collection;
    this.sticker = sticker;
  }

  public int getId() {
    return this.id;
  }

  public Sticker getSticker() {
    return this.sticker;
  }

  public Collection getCollection() {
    return this.collection;
  }

  // No setters because CollectionItems should be immutable, if you
  // change either the sticker or the collection it is just a new item
}
