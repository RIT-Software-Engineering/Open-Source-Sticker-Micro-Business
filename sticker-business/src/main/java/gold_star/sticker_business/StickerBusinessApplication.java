package gold_star.sticker_business;

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
  }
}
