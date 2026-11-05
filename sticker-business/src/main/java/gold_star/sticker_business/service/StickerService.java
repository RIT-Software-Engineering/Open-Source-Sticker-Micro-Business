package gold_star.sticker_business.service;

import gold_star.sticker_business.storage.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StickerService {

  private final FileStorageService fileStorageService;

  public StickerService(FileStorageService fileStorageService) {
    this.fileStorageService = fileStorageService;
  }

  public String uploadStickerArtwork(MultipartFile file) {
    return fileStorageService.storeStickerArtwork(file);
  }
}
