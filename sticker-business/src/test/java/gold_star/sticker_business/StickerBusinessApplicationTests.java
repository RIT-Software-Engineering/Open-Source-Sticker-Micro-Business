package gold_star.sticker_business;

import org.hibernate.jpa.HibernatePersistenceConfiguration;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class StickerBusinessApplicationTests {
  HibernatePersistenceConfiguration sessionFactory = new HibernatePersistenceConfiguration("Test");

  @Test
  void contextLoads() {}

  @Test
  void dataSchemaValidates() {
    sessionFactory.getSchemaManager().validate();
  }
}
