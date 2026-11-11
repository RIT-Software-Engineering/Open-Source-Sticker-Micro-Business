package entities;

import jakarta.persistence.AttributeConverter;
import java.util.HashMap;

public class StickerSheetJSONConverter
    implements AttributeConverter<HashMap<Sticker, Integer>, String> {

  @Override
  public String convertToDatabaseColumn(HashMap<Sticker, Integer> stickerIds) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'convertToDatabaseColumn'");
  }

  @Override
  public HashMap<Sticker, Integer> convertToEntityAttribute(String stickerIdsJSON) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'convertToEntityAttribute'");
  }
}
