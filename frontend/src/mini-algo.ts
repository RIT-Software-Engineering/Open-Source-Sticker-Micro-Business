export const STAGING_AREA_CAPACITY = 45;
const MAX_REMOVAL_OPTIONS = 5;
const MAX_STICKERS_PER_REMOVAL_OPTION = 3;

export interface Sticker {
	name: string;
	sizeArea: number;
	description: string;
	tags: string[];
	id: string;
	categorySection: string;
	hpglFilePath: string;
	svgLocation: string;
}

export interface StickerSelection {
	id: string;
	sticker: Sticker;
	quantity: number;
}

export interface StagingArea {
	accountId: string;
	stickers: StickerSelection[];
}

export interface FitTestResult {
	fits: boolean;
	stickersToRemove: StickerSelection[][];
}

export const sticker: Sticker = {
	name: '',
	sizeArea: 3,
	description: '',
	tags: [],
	id: '',
	categorySection: '',
	hpglFilePath: '',
	svgLocation: '',
};

export const sticker_selection: StickerSelection = {
	id: '',
	sticker,
	quantity: 1,
};

export function fitTest(
	stagingArea: Pick<StagingArea, 'stickers'>,
	stickerToAdd: StickerSelection | null | undefined,
): FitTestResult {
	if (!stickerToAdd) {
		return { fits: false, stickersToRemove: [] };
	}

	const existingArea = stagingArea.stickers.reduce((totalArea, currentSticker) => {
		return totalArea + currentSticker.sticker.sizeArea * currentSticker.quantity;
	}, 0);

	const stickerArea = stickerToAdd.sticker.sizeArea * stickerToAdd.quantity;
	if (stickerArea > STAGING_AREA_CAPACITY) {
		return { fits: false, stickersToRemove: [] };
	}

	const excessArea = existingArea + stickerArea - STAGING_AREA_CAPACITY;
	if (excessArea > 0) {
		const candidates = stagingArea.stickers
			.map((selection, index) => ({
				selection,
				index,
				area: selection.sticker.sizeArea * selection.quantity,
			}))
			.sort((left, right) => right.area - left.area);

		for (
			let selectionCount = 1;
			selectionCount <= Math.min(candidates.length, MAX_STICKERS_PER_REMOVAL_OPTION);
			selectionCount++
		) {
			const options: StickerSelection[][] = [];
			const selected: typeof candidates = [];

			function collectOptions(startIndex: number, freedArea: number): void {
				if (options.length >= MAX_REMOVAL_OPTIONS) {
					return;
				}

				if (selected.length === selectionCount) {
					if (freedArea >= excessArea) {
						options.push(
							[...selected]
								.sort((left, right) => left.index - right.index)
								.map(({ selection }) => selection),
						);
					}
					return;
				}

				const remainingCount = selectionCount - selected.length;
				if (candidates.length - startIndex < remainingCount) {
					return;
				}

				let maximumRemainingArea = 0;
				for (let index = startIndex; index < startIndex + remainingCount; index++) {
					maximumRemainingArea += candidates[index].area;
				}
				if (freedArea + maximumRemainingArea < excessArea) {
					return;
				}

				for (
					let index = startIndex;
					index <= candidates.length - remainingCount &&
					options.length < MAX_REMOVAL_OPTIONS;
					index++
				) {
					selected.push(candidates[index]);
					collectOptions(index + 1, freedArea + candidates[index].area);
					selected.pop();
				}
			}

			collectOptions(0, 0);
			if (options.length > 0) {
				return { fits: false, stickersToRemove: options };
			}
		}

		return { fits: false, stickersToRemove: [] };
	}

	return { fits: true, stickersToRemove: [] };
}
