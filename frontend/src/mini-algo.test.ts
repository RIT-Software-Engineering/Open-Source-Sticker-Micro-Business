/// <reference types="node" />

import assert from 'node:assert/strict';
import test from 'node:test';
import {
	fitTest,
	STAGING_AREA_CAPACITY,
	type Sticker,
	type StickerSelection,
} from './mini-algo.ts';

const baseSticker: Sticker = {
	name: '',
	height: 1,
	width: 1,
	description: '',
	tags: [],
	id: '',
	categorySection: '',
	hpglFilePath: '',
	svgLocation: '',
};

function selection(id: string, height: number, width = 1, quantity = 1): StickerSelection {
	return {
		id,
		sticker: { ...baseSticker, id, height, width },
		quantity,
	};
}


// tests moved into their own file using github copilot (and turned into actual tests)
test('accepts a sticker that fits without mutating the staging area', () => {
	const existing = selection('existing', 6, 7);
	const stagingArea = { stickers: [existing] };

	assert.deepEqual(fitTest(stagingArea, selection('new', 1, 3)), {
		fits: true,
		stickersToRemove: [],
	});
	assert.deepEqual(stagingArea.stickers, [existing]);
});

test('suggests removing existing stickers when the area is full', () => {
	const existing = selection('existing', 6, 7);
	const stagingArea = { stickers: [existing] };

	assert.deepEqual(fitTest(stagingArea, selection('new', 2, 2)), {
		fits: false,
		stickersToRemove: [[existing]],
	});
	assert.deepEqual(stagingArea.stickers, [existing]);
});

test('rejects a missing sticker', () => {
	assert.deepEqual(fitTest({ stickers: [] }, null), {
		fits: false,
		stickersToRemove: [],
	});
	assert.deepEqual(fitTest({ stickers: [] }, undefined), {
		fits: false,
		stickersToRemove: [],
	});
});

test('rejects a sticker quantity that exceeds capacity', () => {
	assert.deepEqual(fitTest({ stickers: [] }, selection('too-large', 5, 5, 2)), {
		fits: false,
		stickersToRemove: [],
	});
});

test('suggests combinations of existing stickers when needed', () => {
	const first = selection('first', 2, 5);
	const second = selection('second', 4, 5);
	const stagingArea = { stickers: [first, second] };

	assert.deepEqual(fitTest(stagingArea, selection('new', 6, 6)), {
		fits: false,
		stickersToRemove: [[first, second]],
	});
});

test('prefers the smallest removal option and preserves staging order', () => {
	const small = selection('small', 1, 2);
	const large = selection('large', 4, 5);

	assert.deepEqual(fitTest({ stickers: [small, large] }, selection('new', 5, 6)), {
		fits: false,
		stickersToRemove: [[large]],
	});
});

test('returns alternate removal combinations in staging order', () => {
	const first = selection('first', 4, 5);
	const second = selection('second', 5, 4);
	const third = selection('third', 2, 5);

	assert.deepEqual(
		fitTest({ stickers: [first, second, third] }, selection('new', 4, 5)),
		{
			fits: false,
			stickersToRemove: [
				[first, second],
				[first, third],
				[second, third],
			],
		},
	);
});

test('only suggests removing up to three stickers', () => {
	const stickers = Array.from({ length: 12 }, (_, index) =>
		selection(`sticker-${index}`, 1, 5),
	);

	assert.deepEqual(fitTest({ stickers }, selection('new', 1, 3)), {
		fits: false,
		stickersToRemove: [],
	});
});

test('caps removal suggestions at five options', () => {
	const stickers = Array.from({ length: 5 }, (_, index) =>
		selection(`option-${index}`, 4, 5),
	);
	const result = fitTest({ stickers }, selection('new', 1, 5));

	assert.equal(result.stickersToRemove.length, 5);
	assert(result.stickersToRemove.every((option) => option.length <= 3));
});

test('rejects a sticker larger than the staging area capacity', () => {
	assert.deepEqual(
		fitTest(
			{ stickers: [selection('existing', 1, 3)] },
			selection('too-large', STAGING_AREA_CAPACITY + 1, 1),
		),
		{ fits: false, stickersToRemove: [] },
	);
});
