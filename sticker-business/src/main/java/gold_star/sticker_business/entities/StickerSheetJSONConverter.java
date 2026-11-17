package gold_star.sticker_business.entities;

import jakarta.persistence.AttributeConverter;
import java.util.Map;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public class StickerSheetJSONConverter
    implements AttributeConverter<Map<Sticker, Integer>, String> {
  ObjectMapper objMapper = new ObjectMapper();

  @Override
  public String convertToDatabaseColumn(Map<Sticker, Integer> stickerIds) {
    return objMapper.writeValueAsString(stickerIds);
  }

  @Override
  public Map<Sticker, Integer> convertToEntityAttribute(String stickerIdsJSON) {
    return objMapper.readValue(stickerIdsJSON, new TypeReference<Map<Sticker, Integer>>() {});
  }
}
