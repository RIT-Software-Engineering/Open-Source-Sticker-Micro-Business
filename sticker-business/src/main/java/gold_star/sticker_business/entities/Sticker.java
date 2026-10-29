import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Sticker")
public class Sticker {
  @Id @GeneratedValue private int id;

  @Column(name = "name")
  private String name;

  @Column(name = "length")
  private double length;

  @Column(name = "width")
  private double width;

  @Column(name = "desc")
  private String desc;

  // category

  @Column(name = "svgPath")
  private String svgPath;

  @Column(name = "active")
  private boolean active;

  public Sticker(String name, double length, double width, String desc) {
    this.name = name;
    this.length = length;
    this.width = width;
    this.desc = desc;

    // Default
    this.active = true;
  }
}
