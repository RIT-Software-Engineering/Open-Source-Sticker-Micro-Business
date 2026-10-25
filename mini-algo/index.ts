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

interface StagingArea {
	accountId: string;
	stickers: Sticker[];
}

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

const staging_area: StagingArea = {
	accountId: '',
	stickers: [{ ...sticker, sizeArea: 42 }],
};

function fitTest(
	stagingArea: Pick<StagingArea, 'stickers'>,
	stickerToAdd: Sticker | null | undefined,
): boolean {
	if (!stickerToAdd) {
		return false;
	}

	const existingArea = stagingArea.stickers.reduce((totalArea, currentSticker) => {
		return totalArea + currentSticker.sizeArea;
	}, 0);

	const stickerArea = stickerToAdd.sizeArea;
	if (existingArea + stickerArea > SQUARE_INCHES) {
		return false;
	}

	stagingArea.stickers.push(stickerToAdd);
	return true;
}

function testFitTest(): void {
	const fittingArea = { stickers: [{ ...sticker, sizeArea: 42 }] };
	assert.equal(fitTest(fittingArea, { ...sticker, sizeArea: 3 }), true);
	assert.equal(fittingArea.stickers.length, 2);

	const fullArea = { stickers: [{ ...sticker, sizeArea: 42 }] };
	assert.equal(fitTest(fullArea, { ...sticker, sizeArea: 4 }), false);
	assert.equal(fullArea.stickers.length, 1);
	assert.equal(fitTest(fullArea, null), false);
}

function main(): void {
	testFitTest();

	console.log('fitTest checks passed.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	main();
}

export { fitTest, sticker };
