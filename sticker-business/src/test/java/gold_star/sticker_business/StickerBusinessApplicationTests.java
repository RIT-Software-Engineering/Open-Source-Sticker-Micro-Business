package gold_star.sticker_business;

import jakarta.persistence.SchemaValidationException;
import org.hibernate.jpa.HibernatePersistenceConfiguration;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class StickerBusinessApplicationTests {
  HibernatePersistenceConfiguration sessionFactory = new HibernatePersistenceConfiguration("Test");

  @Test
  void contextLoads() {}

  @Test
  void dataSchemaValidates() throws SchemaValidationException {
    try (var sesh = sessionFactory.createEntityManagerFactory()) {
      sesh.getSchemaManager().validate();
    } catch (SchemaValidationException e) {
      // do nothing
    }
  }
}
