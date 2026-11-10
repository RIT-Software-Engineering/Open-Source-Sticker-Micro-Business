package entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Tag")
public class Tag {
  @Id @GeneratedValue private int id;

  @Column(unique = true)
  private String label;

  public Tag() {}

  public Tag(String label) {
    this.label = label;
  }

  public int getId() {
    return this.id;
  }

  public String getLabel() {
    return this.label;
  }

  // No setters because tags are meant to be immutable, a different
  // label is just a different tag
}
