package gold_star.sticker_business.entities;

// import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "StickerSheets")
public class StickerSheets {
  @Id @GeneratedValue private int id;

  private String filePath;

  private String stickerIdsJSON;

  //   @Convert(converter = HashMapConverter.class)
  //   private Map<Sticker, int> stickerIds;
}
