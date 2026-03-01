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

This generates one distributable archive that you can upload to the plugin marketplace