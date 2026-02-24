# Chaos Protocol — Tech Stack Analysis

## Game Requirements vs Engine Needs

| Aspect | Requirement | Priority |
|---|---|---|
| **Rendering** | 2D grid, sprites, particles, layered effects | ★★★ |
| **Scene management** | Node map, battles, menus, shops, bosses | ★★★ |
| **State complexity** | 12+ systems stacking, complex game logic | ★★★ |
| **Input** | Click/tap on grid tiles, drag cards | ★★★ |
| **Dev ergonomics** | TypeScript, hot reload, debugging ease | ★★★ |
| **Audio** | Per-region music, many SFX, crossfading | ★★ |
| **Animation** | Tweens, particles, screen shake, transitions | ★★ |
| **Performance** | Many entities + effects stacking | ★★ |
| **Build size** | Small for web portals (CrazyGames < 5MB) | ★★ |
| **Mobile** | Touch, responsive layout | ★★ |
| **Desktop** | Wrap for Steam (Tauri/Electron) | ★ |
| **Multiplayer** | WebSocket/WebRTC (future, v1.0+) | ★ |

---

## Engine Comparison

### 1. Phaser 3 ✅ (CHOSEN)

| Pros | Cons |
|---|---|
| Most popular HTML5 game framework | Scene system can be rigid for complex UIs |
| Huge community, tons of tutorials | No built-in ECS (Entity Component System) |
| Built-in physics, tweens, particles, audio | State management is DIY |
| Scene manager maps to our game structure | Can feel "heavy" for turn-based |
| WebGL + Canvas fallback | Particle system decent but not amazing |
| Battle-tested for this exact game type | |
| Excellent TypeScript support | |

### 2. PixiJS ❌

| Pros | Cons |
|---|---|
| Fastest 2D WebGL renderer | JUST a renderer — no game framework |
| Tiny bundle size | No scene manager, audio, or input system |
| Maximum control | You build everything from scratch |

**Rejected:** Too low-level. We'd spend weeks building what Phaser gives for free.

### 3. Excalibur.js 🤔

| Pros | Cons |
|---|---|
| Built in TypeScript from ground up | Much smaller community |
| Modern Actor/Component architecture | Fewer tutorials and examples |
| Good for complex state | Less battle-tested at scale |

**Rejected (but interesting):** TypeScript-first design is nice but Phaser's ecosystem is 10x larger.

### 4. Godot (HTML5 export) ❌

| Pros | Cons |
|---|---|
| Full engine with editor | HTML5 export is 20–40MB (kills web portals) |
| Built-in node system | Not native web |
| Desktop/mobile export built-in | Overkill for 2D grid game |

**Rejected:** Export size alone disqualifies it for CrazyGames/Poki targets.

### 5. Kaplay (formerly Kaboom.js) ❌

| Pros | Cons |
|---|---|
| Extremely simple API | Too simple for 15+ stacking systems |
| Fast prototyping | Limited scene management |
| Small bundle size | Would outgrow it quickly |

**Rejected:** Great for game jams, too limited for our scope.

### 6. Custom Canvas + TypeScript ❌

| Pros | Cons |
|---|---|
| Maximum control, smallest bundle | Months of engine work before game work |
| No framework overhead | Everything is DIY |

**Rejected:** We want to build a game, not an engine.

---

## Chosen Stack

| Layer | Tool | Version | Purpose |
|---|---|---|---|
| **Engine** | Phaser 3 | 3.80+ | 2D rendering, scenes, input, audio, tweens, particles |
| **Language** | TypeScript | 5.x | Type safety, better tooling |
| **Build** | Vite | 6.x | Fast dev server, HMR, optimized production builds |
| **State** | Pure TypeScript | — | Game logic layer independent of Phaser |
| **Saves** | localStorage | — | Meta-progression persistence |
| **Audio** | Phaser built-in | — | Use Phaser's audio manager (Howler.js as fallback) |
| **Desktop** | Tauri | 2.x | Steam release (tiny binary vs Electron) |
| **Mobile** | Capacitor | — | Android/iOS wrapper (future) |

### Supporting Tools

| Tool | Purpose |
|---|---|
| **Aseprite** | Pixel art sprite creation and animation |
| **TexturePacker** | Sprite atlas generation for performance |
| **Tiled** | Map/level editor for board layouts |
| **Audacity** | Sound effect editing |
| **BFXR/jsfxr** | Retro sound effect generation |

---

## Architecture: Separation of Concerns

The most important architectural decision: **game logic NEVER imports Phaser**.

```
┌─────────────────────────────────────┐
│          PHASER LAYER               │
│  (rendering, input, audio, scenes)  │
│  - Reads game state → draws it      │
│  - Captures input → sends to logic  │
└──────────────┬──────────────────────┘
               │ events / callbacks
               ▼
┌─────────────────────────────────────┐
│        GAME LOGIC LAYER             │
│  (pure TypeScript, zero Phaser)     │
│  - Chess rules, mine logic, etc.    │
│  - Turn management, win/lose        │
│  - Card effects, enemy AI           │
│  - All 15 region systems            │
└──────────────┬──────────────────────┘
               │ read/write
               ▼
┌─────────────────────────────────────┐
│          DATA LAYER                 │
│  (state, saves, constants)          │
│  - Board state (tiles, pieces)      │
│  - Player state (cards, HP, gold)   │
│  - Run state (region, node, path)   │
│  - Meta-progression (unlocks)       │
│  - localStorage for persistence     │
└─────────────────────────────────────┘
```

### Why this matters:
- Game logic can be **unit tested** without Phaser
- Easier to debug (logic bugs vs rendering bugs)
- Multiplayer: game logic runs on server, Phaser only on client
- Could swap Phaser for another renderer without rewriting game rules
- Each of the 15 region systems is a clean TypeScript module
