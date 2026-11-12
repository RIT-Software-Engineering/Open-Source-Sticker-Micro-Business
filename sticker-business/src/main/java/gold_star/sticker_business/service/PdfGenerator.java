package gold_star.sticker_business.service;

import gold_star.sticker_business.model.Placement;
import java.util.List;

public interface PdfGenerator {

  void generate(List<Placement> placements, double width, double height);
}
