# Gif Visuals

Gif Visuals is a live, full-screen GIF visualizer for events, parties, and
screen-based installations. It fills the browser window with a tiled wall of
animated GIFs, applies rhythmic visual effects, and lets a second browser act as
a mobile controller for changing GIF sets, grid density, speed, effects, and the
large text overlay.

![A grid of rendered gifs](https://github.com/peralov/gif-visuals/blob/gif-visuals-nodejs/public/img/cover1.png?raw=true)

A static demo is available at <https://peralov.github.io/gif-visuals>.

## Project Idea

The project is designed around a simple performance setup:

1. Open the main visualizer on a projector, TV, or large display.
2. Open the mobile controller on a phone or second device.
3. Use the controller or keyboard shortcuts to switch visual moods in real time.

The main screen is intentionally minimal: the GIF grid is the interface. The
controller keeps operational controls away from the projected display, making the
visualizer useful in live settings where the audience should only see the
output.

The project also supports a static fallback. If the main page is opened without
the Socket.IO server, it uses built-in mock data so the visualizer can still run
from a static host such as GitHub Pages.

## Runtime Architecture

The app has three cooperating parts:

- **Express server**: serves files from `public/` and hosts Socket.IO.
- **GIF data API**: scans `public/gifs/` and keeps the current visual state in
  memory.
- **Browser clients**: the main visualizer renders the GIF wall, while the
  mobile controller sends updates over Socket.IO.

The live state is not stored in a database. It lives in the Node.js process and
is rebuilt from the files in `public/gifs/` when the server starts.

The frontend is deliberately plain browser technology: pure JavaScript, HTML,
and CSS, with no React, Vue, Angular, Svelte, or other UI framework. Animation
behavior is driven by CSS effects. JavaScript chooses the active effect and adds
frame-state classes to each GIF tile; CSS decides how those classes look and
move.

```text
mobile controller
      |
      | Socket.IO update events
      v
Express + Socket.IO server
      |
      | broadcasts current visual state
      v
main visualizer
```

## Project Structure

```text
.
|-- index.js                         # Express and Socket.IO server
|-- gifsApi.js                       # In-memory visual state and GIF directory scanning
|-- package.json                     # npm scripts and dependencies
|-- vite.config.js                   # Vite config for local static serving and Pages builds
|-- scripts/
|   `-- prepare-pages-dist.mjs       # Copies static assets into dist for GitHub Pages
|-- public/
|   |-- index.html                   # Main visualizer HTML
|   |-- client/
|   |   |-- controller.js            # Main visualizer controller and socket handling
|   |   |-- view.js                  # Grid sizing and GIF tile rendering
|   |   |-- effects.js               # Effect timing and per-frame class updates
|   |   `-- helpers.js               # Shared browser helpers
|   |-- css/
|   |   |-- style.css                # Main visual layout
|   |   |-- effects.css              # Visual effect styles
|   |   `-- csshake.min.css          # External shake animation stylesheet
|   |-- gifs/                        # GIF categories, one folder per category
|   |-- img/                         # Social and supporting image assets
|   `-- mobile/
|       |-- mobile.html              # Full mobile controller
|       |-- sms.html                 # Text-only controller view
|       |-- mobileController.js      # Mobile controller socket logic
|       `-- style.css                # Mobile controller styles
`-- dist/                            # Generated build output
```

## Main Files

### `index.js`

Creates the Express app, HTTP server, Socket.IO server, and `gifsApi` instance.
It serves static assets from `public/`, exposes mobile routes, handles client
connections, and broadcasts state changes.

The server listens on:

```text
process.env.PORT || 8000
```

Socket events handled by the server:

- `init`: returns the current visual state to a newly connected client.
- `update`: accepts a setting type and value, updates `gifsApi`, and broadcasts
  the new state to other connected clients.

The server also runs an auto-update timer every 20 seconds. When it fires, it
selects a random grid size and random GIF category, then broadcasts the new
state.

### `gifsApi.js`

Owns the current visualizer state:

- selected GIF list
- active visual effect
- grid size
- effect speed
- overlay word
- full GIF category tree

On startup, it scans `public/gifs/`. Each direct child folder becomes one GIF
category, and each file inside that folder becomes one selectable visual asset.

The browser-facing state shape is:

```js
{
  imageTree: [...],
  images: [...],
  effect: "colorEffect",
  speed: 1,
  word: "TRAP DA FUCK UP 2.4",
  grid: 8
}
```

### `public/client/controller.js`

Coordinates the main visualizer page. It connects to Socket.IO when available,
falls back to mock data when the socket client is missing, initializes the grid,
handles incoming server updates, and binds keyboard shortcuts.

### `public/client/view.js`

Builds and updates the tiled GIF wall. It computes tile dimensions from the
browser viewport, creates or removes tile elements as the grid size changes, and
assigns GIF backgrounds to each tile.

### `public/client/effects.js`

Applies animated visual modes by changing CSS classes on each tile over time.
The CSS in `public/css/effects.css` controls the actual appearance of each
effect. This keeps the animation system simple: JavaScript handles timing and
state, while CSS handles transforms, filters, opacity, transitions, and layout
changes.

Available effects:

- `colorEffect`
- `swipeEffect`
- `flipEffect`
- `invertEffect`
- `shakeEffect`

## Adding More Animations

New animations can be added by following the existing naming and class
conventions:

1. Add an effect definition to `effectsDef` in `public/client/effects.js`.

   ```js
   { type: "myEffect", time: 500, desc: "MY EFFECT" }
   ```

2. Add matching CSS selectors in `public/css/effects.css`.

   ```css
   .myEffect {
     transition: transform .4s, filter .4s, opacity .4s;
   }

   .myEffect.active {
     transform: scale(1.2);
   }
   ```

3. Use the frame-state classes already applied by `VisualEffects` when useful:
   `active`, `prev`, `next`, `range`, `row`, `col`, `even`, `odd`, `above`, and
   `bellow`.

4. Add a mobile controller button or keyboard shortcut if the new effect should
   be directly selectable from the UI.

The important convention is that the `type` value in `effectsDef` must match the
CSS class name. For example, `type: "flipEffect"` maps to `.flipEffect` rules in
`effects.css`.

### `public/mobile/mobileController.js`

Powers the mobile controller. It connects to Socket.IO, asks the server for the
current GIF categories, renders category buttons from `imageTree`, and emits
updates when the user taps controls or submits text.

## Development Setup

### Requirements

- Node.js 18 or newer
- npm

### Install Dependencies

```bash
npm install
```

### Run The Live App

Start the backend server:

```bash
npm start
```

The backend listens on <http://localhost:8000> by default.

In another terminal, start Vite:

```bash
npm run dev
```

Vite serves the frontend from `public/`, usually at
<http://localhost:5173>. It proxies `/socket.io` traffic to the backend on
`localhost:8000`.

Open these pages while both processes are running:

- Main visualizer: <http://localhost:5173>
- Mobile controller: <http://localhost:5173/mobile/mobile.html>
- Text-only controller: <http://localhost:5173/mobile/sms.html>

You can also open the Express-served version directly at
<http://localhost:8000>, though Vite is the smoother development path for static
assets.

## Controls

### Keyboard Shortcuts

Use these on the main visualizer page:

| Key | Action |
| --- | --- |
| `1`-`9` | Change the grid column count |
| `q` | Apply `colorEffect` |
| `w` | Apply `shakeEffect` |
| `e` | Apply `invertEffect` |
| `r` | Apply `flipEffect` |
| `f` | Apply `swipeEffect` |
| `a` | Load a random GIF category from local mock data |
| `space` | Toggle the overlay help/header panel |

### Mobile Controller

The mobile controller can:

- switch GIF categories
- change grid density
- change animation speed
- change visual effect
- update the large overlay word

The controller sends updates to the server, and the server broadcasts the
resulting state to all other connected clients.

## Adding GIFs

Add a new folder under `public/gifs/` to create a new GIF category:

```text
public/gifs/my-category/
|-- first.gif
|-- second.gif
`-- third.gif
```

Restart the Node.js server after changing GIF folders. The category tree is
generated when `gifsApi` is constructed, so a running server will not
automatically discover new files.

Use web-friendly filenames where possible. The current scanner includes every
file found inside each category folder, so keep non-GIF files out of
`public/gifs/`.

## Build And Static Deployment

Build the frontend with Vite:

```bash
npm run build
```

Prepare the GitHub Pages distribution:

```bash
npm run build:pages
```

`build:pages` runs the Vite build and then copies the classic browser scripts,
CSS, GIFs, images, and mobile files into `dist/`. This extra copy step matters
because the app uses non-module `<script>` tags that Vite does not bundle into
the generated asset graph.

The resulting `dist/` directory contains:

- `index.html`
- `.nojekyll`
- `assets/`
- `client/`
- `css/`
- `gifs/`
- `img/`
- `mobile/`

The Vite base path is configured as `/gif-visuals/`, which matches the GitHub
Pages demo URL.

## Data Flow

1. The server starts and `gifsApi` scans `public/gifs/`.
2. The visualizer connects and emits `init`.
3. The server returns the current state.
4. The visualizer renders the GIF grid and starts effect animation.
5. The mobile controller connects and emits `init`.
6. The controller renders one selectable item for each GIF category.
7. Controller actions emit `update` events.
8. The server mutates the in-memory state and broadcasts the new state.
9. The visualizer receives the update and changes images, grid, effect, speed,
   or text.

## Notes And Maintenance

- The app uses classic browser globals instead of ES modules for the client
  code.
- Socket.IO and Express are intentionally small dependencies here, but the
  pinned versions are old and may produce deprecation warnings on very new Node
  releases.
- `dist/` is generated output. Rebuild it with `npm run build:pages` after
  changing client code or static assets.
- The GitHub Pages version is useful for the standalone visualizer. Live
  multi-device control requires the Node.js Socket.IO server.
