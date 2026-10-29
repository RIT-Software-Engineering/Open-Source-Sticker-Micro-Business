package gold_star.sticker_business.model;

import java.util.Set;

public class Sticker {

  private final int id;
  private final String name;
  private final String design;
  private final String cutOutline;
  private final double physicalWidth;
  private final double physicalHeight;
  private final double borderThickness;
  private final Set<Tag> tags;
  private final Category category;

  public Sticker(
      int id,
      String name,
      String design,
      String cutOutline,
      double physicalWidth,
      double physicalHeight,
      double borderThickness,
      Set<Tag> tags,
      Category category) {
    this.id = id;
    this.name = name;
    this.design = design;
    this.cutOutline = cutOutline;
    this.physicalWidth = physicalWidth;
    this.physicalHeight = physicalHeight;
    this.borderThickness = borderThickness;
    this.tags = tags;
    this.category = category;
  }

  public int getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getDesign() {
    return design;
  }

  public String getCutOutline() {
    return cutOutline;
  }

  public double getPhysicalWidth() {
    return physicalWidth;
  }

  public double getPhysicalHeight() {
    return physicalHeight;
  }

  public double getBorderThickness() {
    return borderThickness;
  }

  public Set<Tag> getTags() {
    return tags;
  }

  public Category getCategory() {
    return category;
  }
}
