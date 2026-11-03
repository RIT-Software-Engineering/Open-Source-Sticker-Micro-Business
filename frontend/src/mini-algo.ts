export const STAGING_AREA_CAPACITY = 45;
const MAX_REMOVAL_OPTIONS = 5;
const MAX_STICKERS_PER_REMOVAL_OPTION = 3;

export interface Sticker {
	name: string;
	height: number;
	width: number;
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
	height: 3,
	width: 3,
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

/**
 * Checks whether a sticker selection can be added to the staging area.
 *
 * Calculates the total area used by the stickers in the staging area.
 * Determines if adding the new sticker selection would exceed the staging area's capacity.
 * If the new selection would exceed the capacity, it identifies combinations of existing selections that could be removed to make room.
 * Returns a `FitTestResult` object containing whether the new selection fits and the suggested combinations to remove if it doesn't.
 * STAGING_AREA_CAPACITY, MAX_REMOVAL_OPTIONS, MAX_STICKERS_PER_REMOVAL_OPTION define limits for the function's behavior.
 *
 * A result with `fits: false` and non-empty `stickersToRemove` means the new
 * selection could fit if one of the suggested combinations were removed.
 */
export function fitTest(
	stagingArea: Pick<StagingArea, 'stickers'>,
	stickerToAdd: StickerSelection | null | undefined,
): FitTestResult {
	if (!stickerToAdd) {
		return { fits: false, stickersToRemove: [] };
	}

	// calculate the area of stickers in the staging area
	const existingArea = stagingArea.stickers.reduce((totalArea, currentSticker) => {
		return totalArea + currentSticker.sticker.height * currentSticker.sticker.width * currentSticker.quantity;
	}, 0);

	// calculate area of sticker(s) to add
	const stickerArea = stickerToAdd.sticker.height * stickerToAdd.sticker.width * stickerToAdd.quantity;
	
	// sticker cannot fit in area capacity?
	if (stickerArea > STAGING_AREA_CAPACITY) {
		return { fits: false, stickersToRemove: [] };
	}

	const excessArea = existingArea + stickerArea - STAGING_AREA_CAPACITY;
	
	if (excessArea > 0) {
		// Create a list of stickers, their indexes, and areas in the staging area with their sizes
		// sorted from greatest area to least area. 
		const candidates = stagingArea.stickers
			.map((selection, index) => ({
				selection,
				index,
				area: selection.sticker.height * selection.sticker.width * selection.quantity,
			}))
			.sort((left, right) => right.area - left.area);

		// For each selectioncount up to either the number of canidates or the max stickers per removal option
		for (
			let selectionCount = 1;
			selectionCount <= Math.min(candidates.length, MAX_STICKERS_PER_REMOVAL_OPTION);
			selectionCount++
		) {
			// Array for selected stickers to remove and the list of options to remove from the staging area
			const options: StickerSelection[][] = [];
			const selected: typeof candidates = [];

			// Recursive function to find a list of options to remove from the stickers in the staging area.
			function collectOptions(startIndex: number, freedArea: number): void {
				// Stop the recursion once we have gathered enough removal options.
				if (options.length >= MAX_REMOVAL_OPTIONS) {
					return;
				}

				// If the current selected combination of stickers is equal to selectionCount,
				// we examine if removing those stickers frees enough space
				// to accommodate the excessArea. If so, we push that combination on to
				// the list of options, sorted by their original staging area index.
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

				// Are there enough candidates left to finish this combination?
				const remainingCount = selectionCount - selected.length;
				if (candidates.length - startIndex < remainingCount) {
					return;
				}

				
				// Make sure that the amount of area that could be freed by the remaining stickers is enough to accommodate the excessArea
				let maximumRemainingArea = 0;
				for (let index = startIndex; index < startIndex + remainingCount; index++) {
					maximumRemainingArea += candidates[index].area;
				}
				if (freedArea + maximumRemainingArea < excessArea) { // if not end
					return;
				}

				// Recursively call this function with a new starting index.
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

			// Start the recursive function to find options of stickers to remove and return results.
			collectOptions(0, 0);
			if (options.length > 0) {
				return { fits: false, stickersToRemove: options };
			}
		}

		// No combination of stickers found.
		return { fits: false, stickersToRemove: [] };
	}

	return { fits: true, stickersToRemove: [] };
}
