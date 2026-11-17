package gold_star.sticker_business.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/cart")
public class CartController {

  @GetMapping
  public ResponseEntity<Void> getCart(@RequestParam int userId) {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  @PostMapping("/items")
  public ResponseEntity<Void> addCartItem(
      @RequestParam int userId, @RequestBody CartItemRequest request) {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  @PutMapping("/items/{cartItemId}")
  public ResponseEntity<Void> updateCartItem(
      @PathVariable int cartItemId, @RequestBody QuantityRequest request) {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  @DeleteMapping("/items/{cartItemId}")
  public ResponseEntity<Void> deleteCartItem(@PathVariable int cartItemId) {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  @PostMapping("/checkout")
  public ResponseEntity<Void> checkoutCart(@RequestParam int userId) {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  public record CartItemRequest(int stickerSheetId, int quantity) {}

  public record QuantityRequest(int quantity) {}
}
