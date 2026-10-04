# Hydra Race prototype

The playable garage shares the roster from cars.jsx. Each selection changes
paint, acceleration, top speed, and steering response. All cars currently use
one detailed prototype chassis; they are not individual replicas of the
roster illustrations.

WASD or arrows drive, Shift boosts, Escape pauses, and R restarts. Touch
controls appear on devices with coarse pointers. Keyboard input is scoped to
the focused race. Leaving the viewport or browser pauses an active race.

The three-lap circuit has seven AI rivals, contact resolution through
cannon-es, track-edge slowdown, boost recharge, position tracking, a minimap,
and results. Handling is assisted arcade driving in circuit coordinates,
not a tire/suspension simulation.

## Rendering

- Exterior car geometry is simplified offline, then batched by material.
- Geometry and most materials are shared across eight cars.
- Repeated foliage, barriers, markings, and rocks are instanced.
- Distant opponents are culled; pixel ratio is capped and adapts downward.
- The garage renders at 30 Hz; paused and offscreen races stop drawing.
- HUD updates are limited to 10 Hz; physics advances at a fixed 60 Hz.
- Model, Draco decoder, preview images, and source attribution are local.
- GPU geometry, materials, textures, observers, audio, and frame callbacks
  are disposed when the component unmounts.

Regenerate the compressed car with npm run models:hydra. The source model
and credits are in public/models. Preview compression is reproducible with
node scripts/optimize-hydra-previews.mjs.

Run the Vite server, then npm run test:hydra. Set HYDRA_URL to change the
default test URL. The browser checks cover selection, acceleration, boost,
pause/restart, a complete race, rendered canvas pixels, mobile layout, and
touch input. The full-race test skips GPU draw submissions while advancing
the real simulation on Playwright's clock.
