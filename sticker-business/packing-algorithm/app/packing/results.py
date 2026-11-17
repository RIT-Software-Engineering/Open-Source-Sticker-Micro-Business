from dataclasses import dataclass, field

@dataclass
class UnplacedSticker:
    sticker: object
    reason: str
    message: str

@dataclass
class PackingResult:
    placements: list = field(default_factory=list)
    unplaced: list[UnplacedSticker] = field(default_factory=list)

    @property
    def requested(self):
        return len(self.placements) + len(self.unplaced)

    @property
    def placed(self):
        return len(self.placements)

    @property
    def success(self):
        return len(self.unplaced) == 0