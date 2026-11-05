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

  public int get_id() {
    return this.id;
  }

  public String get_name() {
    return this.name;
  }

  public double get_length() {
    return this.length;
  }

  public double get_width() {
    return this.width;
  }

  public String get_desc() {
    return desc;
  }

  public String get_svgPath() {
    return svgPath;
  }

  public boolean get_active() {
    return active;
  }

  public void set_name(String name) {
    this.name = name;
  }

  public void set_length(double length) {
    this.length = length;
  }

  public void set_width(double width) {
    this.width = width;
  }

  public void set_desc(String desc) {
    this.desc = desc;
  }

  public void set_SvgPath(String svgPath) {
    this.svgPath = svgPath;
  }

  public void setActive(boolean active) {
    this.active = active;
  }
}
