package gold_star.sticker_business.controller;

import gold_star.sticker_business.service.StickerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/v1/stickers")
public class StickerController {

  private final StickerService stickerService;

  public StickerController(StickerService stickerService) {
    this.stickerService = stickerService;
  }

  @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<String> uploadStickerArtwork(@RequestPart("file") MultipartFile file) {
    String designPath = stickerService.uploadStickerArtwork(file);
    return ResponseEntity.status(HttpStatus.CREATED).body(designPath);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<String> handleInvalidUpload(IllegalArgumentException exception) {
    return ResponseEntity.badRequest().body(exception.getMessage());
  }
}
