package gold_star.sticker_business.controller;

import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/orders")
public class OrderController {

  @GetMapping
  public ResponseEntity<Void> getOrders(@RequestParam(required = false) Optional<Integer> userId) {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  @GetMapping("/{orderId}")
  public ResponseEntity<Void> getOrder(@PathVariable int orderId) {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  @PatchMapping("/{orderId}")
  public ResponseEntity<Void> updateOrderStatus(
      @PathVariable int orderId, @RequestBody OrderStatusRequest request) {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  public record OrderStatusRequest(String status) {}
}
