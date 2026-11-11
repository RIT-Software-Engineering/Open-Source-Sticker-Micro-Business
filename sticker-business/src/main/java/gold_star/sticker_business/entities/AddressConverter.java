package entities;

import jakarta.persistence.AttributeConverter;
import java.util.HashMap;

public class AddressConverter implements AttributeConverter<HashMap<String, String>, String> {

  @Override
  public String convertToDatabaseColumn(HashMap<String, String> address) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'convertToDatabaseColumn'");
  }

  @Override
  public HashMap<String, String> convertToEntityAttribute(String addressJSON) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'convertToEntityAttribute'");
  }
}
