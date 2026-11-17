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
@RequestMapping("/v1/staging-area")
public class StagingAreaController {

  @GetMapping
  public ResponseEntity<Void> getStagingArea(@RequestParam int userId) {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  @PostMapping("/items")
  public ResponseEntity<Void> addStickerSelection(
      @RequestParam int userId, @RequestBody StickerSelectionRequest request) {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  @PutMapping("/items/{stickerSelectionId}")
  public ResponseEntity<Void> updateStickerSelection(
      @PathVariable int stickerSelectionId, @RequestBody QuantityRequest request) {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  @DeleteMapping("/items/{stickerSelectionId}")
  public ResponseEntity<Void> deleteStickerSelection(@PathVariable int stickerSelectionId) {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  @PostMapping("/generate")
  public ResponseEntity<Void> generateStickerSheet(@RequestParam int userId) {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  public record StickerSelectionRequest(int stickerId, int quantity) {}

  public record QuantityRequest(int quantity) {}
}
