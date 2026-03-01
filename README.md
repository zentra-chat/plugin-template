# Counter Channel Plugin

A standalone Zentra plugin that adds a shared **Counter Click** channel type.

Each click sends a message with a counter marker, so every viewer in that channel
sees the same live count through normal message sync/websocket updates.

## Build

```bash
cd counter-channel-plugin
pnpm install
pnpm build
```

Build output:

- `dist/counter-channel-plugin.js`

## Package for marketplace

```bash
cd counter-channel-plugin
pnpm install
pnpm package
```

This generates one distributable archive:

- `build/counter-channel-1.0.0.zplugin.zip`

The archive contains `manifest.json` and the full `dist/` folder, so chunked Vite builds still deploy correctly.
The bundled `manifest.json` is the single source of truth for plugin metadata during publish.

## Publish flow

1. Upload `build/counter-channel-1.0.0.zplugin.zip` in marketplace `/submit` under **Compiled build package**.
2. The marketplace hosts the build and auto-fills everything from `manifest.json`:
   - plugin fields from `manifest.json`
   - `manifest.frontendBundle` with a hosted `/builds/...` URL
3. Click **Publish Plugin**.
3. In Zentra server settings:
   - Add/sync plugin source
   - Install **Counter Channel** plugin
   - Create a channel with type `counter-click`

## Notes

- No frontend internal imports are used.
- Plugin only depends on `@zentra/plugin-sdk`.
- Sync is message-driven, so it works for all connected viewers.
