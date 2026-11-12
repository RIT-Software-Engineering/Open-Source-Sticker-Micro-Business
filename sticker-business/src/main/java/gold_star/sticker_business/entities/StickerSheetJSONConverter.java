package gold_star.sticker_business.entities;

import jakarta.persistence.AttributeConverter;
import java.util.Map;

public class StickerSheetJSONConverter
    implements AttributeConverter<Map<Sticker, Integer>, String> {

  @Override
  public String convertToDatabaseColumn(Map<Sticker, Integer> stickerIds) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'convertToDatabaseColumn'");
  }

  @Override
  public Map<Sticker, Integer> convertToEntityAttribute(String stickerIdsJSON) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'convertToEntityAttribute'");
  }
}
