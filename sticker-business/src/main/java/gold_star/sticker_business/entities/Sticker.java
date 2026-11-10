package entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Sticker")
public class Sticker {
  @Id @GeneratedValue private int id;

  private String name;
  private double length;
  private double width;
  private String desc;
  private String svgPath;
  private boolean active;

  public Sticker() {}

  public Sticker(String name, double length, double width, String desc, String svgPath) {
    this.name = name;
    this.length = length;
    this.width = width;
    this.desc = desc;
    this.svgPath = svgPath;
    // Default
    this.active = true;
  }

  public int getId() {
    return this.id;
  }

  public String getName() {
    return this.name;
  }

  public double getLength() {
    return this.length;
  }

  public double getWidth() {
    return this.width;
  }

  public String getDesc() {
    return desc;
  }

  public String getSvgPath() {
    return svgPath;
  }

  public boolean getActive() {
    return active;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setLength(double length) {
    this.length = length;
  }

  public void setWidth(double width) {
    this.width = width;
  }

  public void setDesc(String desc) {
    this.desc = desc;
  }

  public void setSvgPath(String svgPath) {
    this.svgPath = svgPath;
  }

  public void setActive(boolean active) {
    this.active = active;
  }
}
