package gold_star.sticker_business.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/v1")
public class StickerController {

  @GetMapping("/stickers")
  public ResponseEntity<Void> getStickers() {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  @GetMapping("/stickers/{id}")
  public ResponseEntity<Void> getSticker(@PathVariable int id) {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  @PutMapping("/stickers/{id}")
  public ResponseEntity<Void> updateSticker(
      @PathVariable int id, @RequestBody Map<String, Object> sticker) {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  @DeleteMapping("/stickers/{id}")
  public ResponseEntity<Void> deleteSticker(@PathVariable int id) {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  @PostMapping(value = "/stickers/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<Void> uploadSticker(
      @RequestParam("file") MultipartFile file,
      @RequestParam("name") String name,
      @RequestParam("physicalWidth") double physicalWidth,
      @RequestParam("physicalHeight") double physicalHeight,
      @RequestParam("borderThickness") double borderThickness,
      @RequestParam("tagIds") List<Integer> tagIds) {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  @GetMapping("/stickers-display")
  public ResponseEntity<Void> getDisplayedStickers() {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  @PostMapping("/sticker-display/{id}")
  public ResponseEntity<Void> displaySticker(@PathVariable int id) {
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }
}
