I’m using a bottom-left greedy polygon-packing algorithm with a compactness score. Basically, place the biggest/weirdest/most difficult sticker first, then place the next one in the lowest leftmost position that produces the most compact sheet.
It’s greedy because I’m not planning on moving stickers again after placing them, as that would be very expensive computationally and time-wise. 
It’s not optimal! But it is relatively fast, deterministic, human-readable, and with polygon geometry it can be very good.
For my code and for your visualization, I’m using tetris shapes.

Steps:
Get info from stickers.
For a quick example, 2 5 square pieces.
A
O O 
O
O
O
(0,0)(1,0)
(0,1)
(0,2)
(0,3)

And 
B
O O
O O
O
(0,0)(1,0)
(0,1)(1,1)
(0,2)
(this is just convenient picks to show the program)

2: Sort the stickers
We need to place the largest sticker first, so we sort with a couple parameters.
Area, bounding-box area (ill get to this later), width, height, complexity.
(easiest version:
stickers.sort(
	key=lambda sticker: sticker.area,
	reverse=True
)
)

For example, A would have an area of 5, and so would B. Their bounding box would be 2*4 for A, but only 2*3 for B, so you could put A first because it’s more awkward. Pick weird shapes first.

3: 
The sheet can be whatever size you want, so we can arbitrarily choose what our demo sheet size is (obviously usually it’s 8x4 or whatever the size of a half sheet is)

4:
Sticker by Sticker
First, nothing on the sheet, so the candidate is (0,0)
And you place A there, taking up
(0,0)(1,0)
(0,1)
(0,2)
(0,3)
Then, B:
The laziest implementation would look at every coordinate, but because we’re not just working in whole numbers, that’s not helpful.
We would want to look for each edge of the current shape, including
Right side, bottom line, corners, and internal vertices.
For this example we get (2,0)(1,1)(1,2)(1,3) and (0,4) as options.

5: Where to put it
We go through all of the candidates!
(2,0)
If we place at 2,0 it looks like
O O O O
O X O O
O X O X
O X X X 
So the placement would be (2,0)

(1,1)
It looks like 
O O X X
O O O X
O O O X
O O X X 

Continue for all of those position, then consider rotations of the shape.

A simple algorithm prefers lowest x, then lowest y, cram it all in the corner. However, I also want to consider going for the most square space.
O O X X		feels more helpful than		O O X X
O O X X							O O O X
O O O O 							O O O X 
O O O O							O O O X

Because it can fit a bigger sticker in that space. (Want to figure this out, what im working on currently.)

So, I used a score: height of the shape after placement + wasted space + fragmentation. A lower score is better.

For option (2,0) our choice was
O O O O
O X O O
O X O X
O X X X
With a bounding box of 4*4
Where 
O O X X 
O O O X
O O O X
O O X X
Only has 3*4.
So it chooses that one.

That pattern continues until we get the smallest total area and score.
Obviously normal stickers aren’t just blocks but this is proof of concept that should work.


I’m including a 1-step lookahead, to avoid true recursion and too much burden, but it does help fit bigger stickers.

I’m going to include a variable for this that we can actually change to get deeper, but for now it’s staying at 0 for demos, then 1 for normal stuff, but if we want to go insane for efficiency over time we can deepen it.
Basically it’ll try one sticker, check other answers, go back a step and check again in case one of those is a more accurate fit.


