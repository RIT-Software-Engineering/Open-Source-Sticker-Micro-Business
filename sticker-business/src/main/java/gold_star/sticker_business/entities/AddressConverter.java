package gold_star.sticker_business.entities;

import jakarta.persistence.AttributeConverter;
import java.util.Map;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public class AddressConverter implements AttributeConverter<Map<String, String>, String> {
  ObjectMapper objMapper = new ObjectMapper();

  @Override
  public String convertToDatabaseColumn(Map<String, String> address) {
    return objMapper.writeValueAsString(address);
  }

  @Override
  public Map<String, String> convertToEntityAttribute(String addressJSON) {
    return objMapper.readValue(addressJSON, new TypeReference<Map<String, String>>() {});
  }
}
