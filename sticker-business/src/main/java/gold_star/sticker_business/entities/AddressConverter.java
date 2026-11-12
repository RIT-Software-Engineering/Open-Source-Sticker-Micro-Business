package gold_star.sticker_business.entities;

import jakarta.persistence.AttributeConverter;
import java.util.Map;

public class AddressConverter implements AttributeConverter<Map<String, String>, String> {

  @Override
  public String convertToDatabaseColumn(Map<String, String> address) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'convertToDatabaseColumn'");
  }

  @Override
  public Map<String, String> convertToEntityAttribute(String addressJSON) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'convertToEntityAttribute'");
  }
}
