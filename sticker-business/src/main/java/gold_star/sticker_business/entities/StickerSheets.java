package gold_star.sticker_business.entities;

import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.Map;

@Entity
@SuppressWarnings("NullAway.Init")
@Table(name = "StickerSheets")
public class StickerSheets {
  @Id @GeneratedValue private int id;

  private String filePath;

  private String stickerIdsJSON;

  @Convert(converter = StickerSheetJSONConverter.class)
  private Map<Sticker, Integer> stickerIds;

  public StickerSheets() {}

  public StickerSheets(String filePath, String stickerIdsJSON) {
    this.filePath = filePath;
    this.stickerIdsJSON = stickerIdsJSON;
  }

  public int getId() {
    return this.id;
  }

  public String getFilePath() {
    return this.filePath;
  }

  public String getStickerIdsJSON() {
    return this.stickerIdsJSON;
  }

  public void setFilePath(String filePath) {
    this.filePath = filePath;
  }

  public void setStickerIdsJSON(String stickerIdsJSON) {
    this.stickerIdsJSON = stickerIdsJSON;
  }
}
