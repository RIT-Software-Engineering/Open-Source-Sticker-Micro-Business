package gold_star.sticker_business.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@SuppressWarnings("NullAway.Init")
@Table(name = "TagItems")
public class TagItems {
  @Id @GeneratedValue private int id;

  @ManyToOne // fk to Tag table
  @JoinColumn(name = "tagId", foreignKey = @ForeignKey(name = "TAG_ID_FK"))
  private Tag tag;

  @ManyToOne
  @JoinColumn(name = "stickerId", foreignKey = @ForeignKey(name = "STICKER_ID_FK"))
  private Sticker sticker;

  public TagItems() {}

  public TagItems(Tag tag, Sticker sticker) {
    this.tag = tag;
    this.sticker = sticker;
  }

  public int getId() {
    return this.id;
  }

  public Tag getTag() {
    return this.tag;
  }

  public Sticker getSticker() {
    return this.sticker;
  }

  // no setters because tags are meant to be immutable--if you change either
  // part it's a different tag
}
