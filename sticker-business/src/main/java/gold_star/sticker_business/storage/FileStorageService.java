package gold_star.sticker_business.storage;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

  private final Path stickerDirectory;

  public FileStorageService(@Value("${app.storage.root:../data}") String storageRoot) {
    stickerDirectory = Path.of(storageRoot).toAbsolutePath().normalize().resolve("stickers");

    try {
      Files.createDirectories(stickerDirectory);
    } catch (IOException exception) {
      throw new UncheckedIOException("Could not create the sticker storage directory.", exception);
    }
  }

  public String storeStickerArtwork(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new IllegalArgumentException("An SVG file is required.");
    }

    String originalFilename = file.getOriginalFilename();

    if (originalFilename == null || !originalFilename.toLowerCase(Locale.ROOT).endsWith(".svg")) {
      throw new IllegalArgumentException("Only SVG files are currently supported.");
    }

    String storedFilename = UUID.randomUUID() + ".svg";
    Path destination = stickerDirectory.resolve(storedFilename);

    try (InputStream inputStream = file.getInputStream()) {
      Files.copy(inputStream, destination);
    } catch (IOException exception) {
      throw new UncheckedIOException("Could not store the uploaded SVG.", exception);
    }

    return "stickers/" + storedFilename;
  }
}
