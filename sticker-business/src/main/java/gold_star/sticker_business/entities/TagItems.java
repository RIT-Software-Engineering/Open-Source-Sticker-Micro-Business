package gold_star.sticker_business.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "TagItems")
public class TagItems {
  @Id @GeneratedValue private int id;

  @ManyToOne // fk to Tag table
  @JoinColumn(name = "tagId", foreignKey = @ForeignKey(name = "TAG_ID_FK"))
  private Tag tag;

  //   @ManyToMany private Sticker sticker;
}
