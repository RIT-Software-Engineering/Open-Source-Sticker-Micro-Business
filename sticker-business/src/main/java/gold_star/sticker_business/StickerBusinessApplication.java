package gold_star.sticker_business;

import gold_star.sticker_business.entities.Sticker;
import org.hibernate.SessionFactory;
import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.jspecify.annotations.Nullable;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class StickerBusinessApplication {

  @RequestMapping("/")
  public String home() {
    return "Hello Docker World";
  }

  /** This fails if you remove @Nullable. */
  @RequestMapping("/test")
  public @Nullable String test() {
    // Testing formatter
    String[] longArray = {
      "elementOne",
      "elementTwo",
      "elementThree",
      "elementFour",
      "elementFive",
      "elementSeven",
      "elementEight",
      "elementNine",
      "elementTen"
    };

    return null;
  }

  public static void main(String[] args) {
    SpringApplication.run(StickerBusinessApplication.class, args);

    // A SessionFactory is set up once for an application!
    final StandardServiceRegistry registry = new StandardServiceRegistryBuilder().build();
    SessionFactory sessionFactory;
    try {
      sessionFactory =
          new MetadataSources(registry)
              .addAnnotatedClass(Sticker.class)
              .buildMetadata()
              .buildSessionFactory();
    } catch (Exception e) {
      // The registry would be destroyed by the SessionFactory, but we
      // had trouble building the SessionFactory so destroy it manually.
      StandardServiceRegistryBuilder.destroy(registry);
    }
  }
}
