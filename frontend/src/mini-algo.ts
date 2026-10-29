'use strict';

import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

const SQUARE_INCHES = 45;

interface Sticker {
	name: string;
	sizeArea: number;
	description: string;
	tags: string[];
	id: string;
	categorySection: string;
	hpglFilePath: string;
	svgLocation: string;
}

interface StickerSelection {
	id: string;
	sticker: Sticker;
	quantity: number;
}

interface StagingArea {
	accountId: string;
	stickers: StickerSelection[];
}

interface FitTestResult {
	fits: boolean;
	stickersToRemove: StickerSelection[][];
}

const MAX_REMOVAL_OPTIONS = 5;
const MAX_STICKERS_PER_REMOVAL_OPTION = 3;

const sticker: Sticker = {
	name: '',
	sizeArea: 3,
	description: '',
	tags: [],
	id: '',
	categorySection: '',
	hpglFilePath: '',
	svgLocation: '',
};

const sticker_selection: StickerSelection = {
	id: '',
	sticker,
	quantity: 1,
};

const staging_area: StagingArea = {
	accountId: '',
	stickers: [{ ...sticker_selection, sticker: { ...sticker, sizeArea: 42 } }],
};

function fitTest(
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
	if (stickerArea > SQUARE_INCHES) {
		return { fits: false, stickersToRemove: [] };
	}

	//Stuff for seeing what stickers could be removed
	const excessArea = existingArea + stickerArea - SQUARE_INCHES;
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


			//cool recursive thing you can do inside of functions
			function collectOptions(startIndex: number, freedArea: number): void {
				if (options.length >= MAX_REMOVAL_OPTIONS) {
					return;
				}

				if (selected.length === selectionCount) {
					if (freedArea >= excessArea) {
						options.push(
							[...selected] // shalow copy 
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

	stagingArea.stickers.push(stickerToAdd);
	return { fits: true, stickersToRemove: [] };
}





//test
function testFitTest(): void {
	const fittingArea = {
		stickers: [...staging_area.stickers],
	};
	assert.deepEqual(
		fitTest(fittingArea, {
			...sticker_selection,
			sticker: { ...sticker, sizeArea: 3 },
		}),
		{ fits: true, stickersToRemove: [] },
	);
	assert.equal(fittingArea.stickers.length, 2);

	const fullArea = {
		stickers: [{ ...sticker_selection, sticker: { ...sticker, sizeArea: 42 } }],
	};
	const stickerToAdd = {
		...sticker_selection,
		sticker: { ...sticker, sizeArea: 4 },
	};
	assert.deepEqual(fitTest(fullArea, stickerToAdd), {
		fits: false,
		stickersToRemove: [[...fullArea.stickers]],
	});
	assert.equal(fullArea.stickers.length, 1);
	assert.deepEqual(fitTest(fullArea, null), { fits: false, stickersToRemove: [] });

	const quantityArea = { stickers: [] };
	assert.deepEqual(
		fitTest(quantityArea, {
			...sticker_selection,
			sticker: { ...sticker, sizeArea: 23 },
			quantity: 2,
		}),
		{ fits: false, stickersToRemove: [] },
	);

	const multipleSelectionsArea = {
		stickers: [
			{ ...sticker_selection, sticker: { ...sticker, sizeArea: 10 } },
			{ ...sticker_selection, id: 'second', sticker: { ...sticker, sizeArea: 20 } },
		],
	};
	const suggestions = fitTest(multipleSelectionsArea, {
		...sticker_selection,
		sticker: { ...sticker, sizeArea: 36 },
	});
	assert.deepEqual(suggestions, {
		fits: false,
		stickersToRemove: [[...multipleSelectionsArea.stickers]],
	});
	assert.equal(multipleSelectionsArea.stickers.length, 2);

	const singleOptionArea = {
		stickers: [
			{ ...sticker_selection, id: 'small', sticker: { ...sticker, sizeArea: 2 } },
			{ ...sticker_selection, id: 'large', sticker: { ...sticker, sizeArea: 20 } },
		],
	};
	assert.deepEqual(
		fitTest(singleOptionArea, {
			...sticker_selection,
			sticker: { ...sticker, sizeArea: 30 },
		}),
		{
			fits: false,
			stickersToRemove: [[singleOptionArea.stickers[1]]],
		},
	);

	const alternateOptionsArea = {
		stickers: [
			{ ...sticker_selection, id: 'first', sticker: { ...sticker, sizeArea: 20 } },
			{ ...sticker_selection, id: 'second', sticker: { ...sticker, sizeArea: 20 } },
			{ ...sticker_selection, id: 'third', sticker: { ...sticker, sizeArea: 10 } },
		],
	};
	const alternateOptions = fitTest(alternateOptionsArea, {
		...sticker_selection,
		sticker: { ...sticker, sizeArea: 20 },
	});
	assert.deepEqual(alternateOptions.stickersToRemove, [
		[alternateOptionsArea.stickers[0], alternateOptionsArea.stickers[1]],
		[alternateOptionsArea.stickers[0], alternateOptionsArea.stickers[2]],
		[alternateOptionsArea.stickers[1], alternateOptionsArea.stickers[2]],
	]);

	const cappedOptionsArea = {
		stickers: Array.from({ length: 12 }, (_, index) => ({
			...sticker_selection,
			id: `sticker-${index}`,
			sticker: { ...sticker, sizeArea: 5 },
		})),
	};
	const cappedOptions = fitTest(cappedOptionsArea, {
		...sticker_selection,
		sticker: { ...sticker, sizeArea: 3 },
	});
	assert.deepEqual(cappedOptions.stickersToRemove, []);

	const cappedOptionCountArea = {
		stickers: Array.from({ length: 5 }, (_, index) => ({
			...sticker_selection,
			id: `option-${index}`,
			sticker: { ...sticker, sizeArea: 20 },
		})),
	};
	const cappedOptionCount = fitTest(cappedOptionCountArea, {
		...sticker_selection,
		sticker: { ...sticker, sizeArea: 5 },
	});
	assert.equal(cappedOptionCount.stickersToRemove.length, MAX_REMOVAL_OPTIONS);
	assert(cappedOptionCount.stickersToRemove.every(
		(option) => option.length <= MAX_STICKERS_PER_REMOVAL_OPTION,
	));

	const impossibleArea = {
		stickers: [{ ...sticker_selection, sticker: { ...sticker, sizeArea: 3 } }],
	};
	assert.deepEqual(
		fitTest(impossibleArea, {
			...sticker_selection,
			sticker: { ...sticker, sizeArea: 46 },
		}),
		{ fits: false, stickersToRemove: [] },
	);
}

function main(): void {
	testFitTest();

	console.log('fitTest checks passed.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	main();
}

export { fitTest, sticker, sticker_selection };
