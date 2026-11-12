package gold_star.sticker_business.model;

import java.util.List;
import java.util.Objects;

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

  @Override
  public boolean equals(Object object) {
    if (this == object) {
      return true;
    }
    if (!(object instanceof StagingArea that)) {
      return false;
    }
    return id == that.id
        && Objects.equals(account, that.account)
        && Objects.equals(selections, that.selections);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, account, selections);
  }

  @Override
  public String toString() {
    return "StagingArea{"
        + "id="
        + id
        + ", account="
        + account
        + ", selections="
        + selections
        + '}';
  }
}
