package gold_star.sticker_business.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/categories")
public class CategoryController {

  @GetMapping
  public ResponseEntity<Void> getCategories() {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  @PostMapping
  public ResponseEntity<Void> createCategory(@RequestBody CategoryRequest request) {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Void> getCategory(@PathVariable int id) {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Void> updateCategory(
      @PathVariable int id, @RequestBody CategoryRequest request) {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  public record CategoryRequest(String name) {}
}
