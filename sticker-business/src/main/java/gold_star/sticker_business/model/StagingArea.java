package gold_star.sticker_business.model;

import java.util.List;

public class StagingArea {

  private final int id;
  private final Account account;
  private final List<StickerSelection> selections;

  public StagingArea(int id, Account account, List<StickerSelection> selections) {
    this.id = id;
    this.account = account;
    this.selections = selections;
  }

  public int getId() {
    return id;
  }

  public Account getAccount() {
    return account;
  }

  public List<StickerSelection> getSelections() {
    return selections;
  }
}
