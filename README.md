# Word Popper

Word Popper is a small browser typing game. Words bounce around the playfield, and the player types matching words to pop them before the timer ends.

## Run

Open `index.html` in a browser.

No build step is required. The page loads plain HTML, CSS, and JavaScript files directly. The Google font import in `style.css` needs internet access, but the game still works without it.

## Project Structure

```text
.
|-- index.html
|-- style.css
|-- styles/
|   |-- base.css
|   |-- controls.css
|   |-- game.css
|   |-- layout.css
|   |-- overlays.css
|   `-- theme.css
|-- script.js
|-- scripts/
|   |-- config.js
|   |-- dom.js
|   |-- floaters.js
|   |-- game.js
|   |-- motion.js
|   |-- state.js
|   |-- ui.js
|   |-- word-bank.js
|   `-- words.js
`-- ideas.txt
```

## JavaScript Files

- `scripts/config.js` contains game settings and themes.
- `scripts/dom.js` collects DOM references in one place.
- `scripts/state.js` defines the shared runtime state.
- `scripts/motion.js` contains shared movement, bouncing, clamping, and rotation helpers.
- `scripts/words.js` owns word spawning, popping, lookup, and resize handling.
- `scripts/floaters.js` owns the moving UI panels.
- `scripts/game.js` owns game flow, timers, scoring, and the animation loop.
- `scripts/ui.js` wires buttons, form input, theme controls, overlays, and resize events.
- `scripts/word-bank.js` contains the vocabulary used for spawned words.
- `script.js` is the small bootstrap file that initializes the app.

The files use a shared `window.WordPopper` namespace instead of ES modules so the game can run from a direct `index.html` file open without a local server.

## CSS Files

- `style.css` imports the smaller style files.
- `styles/theme.css` defines theme variables.
- `styles/base.css` handles page-level reset and shell styles.
- `styles/layout.css` handles major panels and page layout.
- `styles/controls.css` handles buttons, inputs, chips, and form controls.
- `styles/game.css` handles the playfield and animated word elements.
- `styles/overlays.css` handles intro, result, and mobile overlays.

## Maintenance Notes

- Add new words in `scripts/word-bank.js`.
- Tune timer and spawn speed in `scripts/config.js`.
- Add feature ideas or backlog notes in `ideas.txt`.
- Keep cross-cutting movement behavior in `scripts/motion.js` so words and floating panels stay consistent.
