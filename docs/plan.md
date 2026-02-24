# Chaos Protocol — Development Timeline

> Open format. Phases → Steps → Notes. Updated as work progresses.

---

## ✅ Phase 0: Foundation (DONE)

> Tech stack selected, project scaffolded, modular architecture built.

### Steps Completed

- [x] **Engine Analysis** — Compared 6 engines (Phaser 3, PixiJS, Excalibur, Godot, Kaplay, Custom Canvas)
- [x] **Tech Stack Chosen** — Phaser 3 + TypeScript + Vite
- [x] **Project Scaffold** — Vite project, `package.json`, `tsconfig.json`, `index.html`
- [x] **Boot → Menu → Game** scene flow working
- [x] **Chess Board** — 8×8 grid rendering, piece selection, valid move highlighting
- [x] **Basic AI** — random legal moves with capture priority
- [x] **Modular Architecture Refactor:**
  - [x] Generic `Board` (tile/entity CRUD, no game knowledge)
  - [x] `Tile` class (type, entity, metadata, passability)
  - [x] `GameSystem` interface (lifecycle hooks for plug-in systems)
  - [x] `ChessSystem` (all chess rules as a pluggable system)
  - [x] `TurnManager` (orchestrates systems, aggregates moves/win)
  - [x] `GameScene` updated to use modular architecture
- [x] **Unit Tests** — 52 passing tests (Board, ChessSystem, TurnManager)
- [x] **Documentation** — `tech-stack.md`, `game-design.md`, `ideas.md`, `plan.md`, `publish-plan.md`, `market-plan.md`, `sharing-plan.md`

### Current File Structure

```
src/
├── main.ts                  # Entry → Phaser config
├── scenes/
│   ├── BootScene.ts         # Loading bar
│   ├── MenuScene.ts         # Title + START
│   └── GameScene.ts         # Board gameplay (uses TurnManager)
├── board/
│   ├── Board.ts             # Generic grid (Tile CRUD)
│   ├── Board.test.ts        # 17 tests
│   └── Tile.ts              # Tile class (type, entity, metadata)
├── game/
│   └── types.ts             # TileType, Entity, PieceType, Move, GameEvent
├── systems/
│   ├── GameSystem.ts        # Interface for plug-in game mechanics
│   ├── ChessSystem.ts       # Chess rules (movement, capture, win)
│   ├── ChessSystem.test.ts  # 22 tests
│   ├── TurnManager.ts       # System orchestrator
│   └── TurnManager.test.ts  # 13 tests
└── utils/
    └── Constants.ts         # Board size, tile size, offsets
```

> **Note:** The architecture is ready. Adding a new game system = 1 new file implementing `GameSystem`, register it with `TurnManager`. Zero changes to Board/Scene/other systems.

---

## 🔲 Phase 1: Complete Region 1 — Chess Kingdom

> Make chess feel like a full region with a campaign structure.

### 1.1 Node Map System
- [ ] Design `NodeMap` data structure (nodes, edges, types)
- [ ] Create `MapNode` class (combat, reward, shop, mystery, rest, boss, elite, gamble)
- [ ] Build `NodeMapScene` — renders the branching path visually
- [ ] Path selection logic — click to advance, no backtracking
- [ ] Warp Token system — off-path node access
- [ ] Node transition animations (travel between nodes)
- [ ] Region banner / intro when entering a new region

> **Note:** This is the most important system after chess itself. Slay the Spire and Inscryption live or die by their map. Make it feel good to navigate.

### 1.2 Combat Polish
- [ ] Win condition: all enemy pieces captured (not just king)
- [ ] Lose condition: king captured
- [ ] Gold earned per battle (based on performance)
- [ ] Battle result screen (stats, gold, XP)
- [ ] Piece health system? (decide: 1-hit kills vs HP for some pieces)

> **Note:** Decide if chess pieces are 1-hit captures (traditional chess) or have HP (more RPG-like). Traditional is simpler and more recognizable. HP could add depth later but adds complexity early.

### 1.3 Card System (V1)
- [ ] `Card` class (name, cost, effect, description, rarity)
- [ ] `CardDeck` (draw pile, hand, discard pile)
- [ ] Hand UI — display 3–5 cards at bottom of screen
- [ ] 3 starter cards: **Swap** (switch 2 piece positions), **Shield** (protect 1 turn), **Double Move**
- [ ] Card draw: 1 per turn
- [ ] Card play: click card → click target → resolve
- [ ] Cards as rewards (card selection screen after victory)

> **Note:** Cards are the glue that ties all systems together. Balatro's lesson: cards should feel powerful and satisfying to play, not just "useful."

### 1.4 Smarter AI
- [ ] Evaluate move quality (capture value, king safety, center control)
- [ ] Basic opening theory (control center, develop pieces)
- [ ] Boss: **The Grandmaster** — plays optimally, adapts strategy
- [ ] Difficulty scaling per node (easier early, harder near boss)

> **Note:** Don't over-invest in chess AI. This isn't a chess game — it's a chaos game. The AI needs to be "good enough" that early battles feel fair, but the real challenge comes from managing multiple systems simultaneously in later regions.

### 1.5 Reward & Shop Nodes
- [ ] Reward node: pick 1 of 3 cards
- [ ] Shop node: spend gold on cards/items/upgrades
- [ ] Rest node: heal or upgrade a piece
- [ ] Mystery node: random event system (good or terrible)
- [ ] Gamble node: risk gold for rare rewards

### 1.6 Game Over & Run Summary
- [ ] Game Over scene (death stats, gold earned, run time)
- [ ] "Run summary card" — shareable screenshot of your chaos
- [ ] Return to menu / start new run

### Phase 1 Deliverable
> Playable roguelite loop: Menu → Node Map → Chess Battles → Boss → Game Over → Repeat. Cards and gold carry through the run. 30-minute session target.

---

## 🔲 Phase 2: Region 2 — The Minefield (Minesweeper)

> First system stack. Chess + Minesweeper. This proves the architecture works.

### 2.1 Minesweeper System
- [ ] `MinesweeperSystem` implementing `GameSystem`
- [ ] Fog tiles (hidden until piece moves adjacent or special action)
- [ ] Number tiles (adjacent mine count displayed)
- [ ] Mine tiles (damage/destroy piece that reveals them)
- [ ] Random mine placement on board generation
- [ ] Tests for mine generation, fog reveal, mine trigger

### 2.2 Board Generation
- [ ] `BoardGenerator` — creates boards per region + difficulty
- [ ] Region 2 boards: chess pieces on partially fogged/mined grid
- [ ] Difficulty curve: more mines as nodes progress toward boss
- [ ] Mixed generation: some tiles are chess, some are minesweeper

### 2.3 New Content
- [ ] Piece specials: Bishop reveals adjacent fog, Knight jumps mines
- [ ] New cards: **Reveal** (show 1 fog tile), **Board Scan** (reveal 3×3 area)
- [ ] New enemy: **Mine Golem** (immune to mines, plants new ones)
- [ ] Boss: **The Mine King** (80% mined board)
- [ ] Region hazard: random mines on all R2 combat nodes

### 2.4 Region Introduction Flow
- [ ] "New system introduced" animation/cutscene when entering R2
- [ ] Quick tutorial popup: "These foggy tiles hide mines. Be careful."
- [ ] Minesweeper visual style layers onto chess board

### Phase 2 Deliverable
> Chess + Minesweeper on the same board. Fog reveals, mines explode, pieces die. First taste of chaos. Two systems proven to stack cleanly.

---

## 🔲 Phase 3: Region 3 — Garden of the Dead (PvZ)

> Three systems deep. The chaos starts to feel real.

### 3.1 PvZ Lane System
- [ ] `PvZSystem` implementing `GameSystem`
- [ ] Lane overlay on the chess grid (rows = lanes)
- [ ] Enemies spawn at far side, auto-march 1 tile/turn toward player
- [ ] Wave system: intensity scales, new waves every few turns
- [ ] Collision: zombie reaches your side = damage to king/HP
- [ ] Tests for lane movement, wave spawning, collision

### 3.2 Plant Pawns
- [ ] Pawns can be "planted" as PvZ units (costs a card)
- [ ] Sunflower (free, +1 card draw/turn)
- [ ] Peashooter (1 card, auto-shoots down lane)
- [ ] Wall-Nut (1 card, blocks lane progress)
- [ ] Cherry Bomb (2 cards, 3×3 AoE, single use)
- [ ] Snow Pea (2 cards, shoots + slows zombies)

### 3.3 New Content
- [ ] Enemies: Walker (1 HP, slow), Runner (1 HP, 2 tiles/turn), Tank (3 HP), Bomber (explodes on death)
- [ ] New cards: **Nuke Row** (destroy all in a row), **Resurrect** (revive captured piece)
- [ ] Boss: **Zombie Overlord** (survive 15 waves while playing chess+mines)
- [ ] Region hazard: zombie spawns on ALL R3 nodes

### Phase 3 Deliverable
> Chess + Mines + PvZ lanes. Move your knight while dodging mines while zombies march toward your king. This is the "holy shit this is actually chaos" moment.

---

## 🔲 Phase 4: Regions 4–5 (Casino + Naval)

> Systems 4 and 5 are medium complexity. Build them together.

### 4.1 Casino / Gambling System (R4)
- [ ] `GamblingSystem` — slot tiles, chests, mimics
- [ ] Slot machine: land on slot tile → spin → 6 possible outcomes
- [ ] Chest tiles: loot or mimic (fight a mini-enemy)
- [ ] Betting mechanic: wager gold for multiplied rewards
- [ ] Boss: **The House** (rigged odds, piece movements have fail %)
- [ ] Region hazard: 20% chance rewards are cursed

### 4.2 Battleship / Naval System (R5)
- [ ] `BattleshipSystem` — hidden ships, fire actions, water tiles
- [ ] Ships placed under tiles (hidden to player)
- [ ] "Fire" action (instead of moving a piece) to reveal/damage ships
- [ ] Missed shots create impassable water tiles
- [ ] Queen special: can fire battleship shots
- [ ] Boss: **Admiral Ironclad** (massive fleet, fires back each turn)
- [ ] Region hazard: water tiles on all R5 boards

### Phase 4 Deliverable
> Five systems stacking. The board is a visual feast of chess pieces, mine numbers, zombie lanes, slot machines, and water tiles. This is the "screenshot goes viral" point.

---

## 🔲 Phase 5: Regions 6–8 (Arcade, Tetris, Craft)

> Three smaller-scope but visually exciting regions.

### 5.1 Arcade Ruins (R6)
- [ ] Snake entity roaming the board (eats gems, kills pieces on collision)
- [ ] Pac-Man ghost (chases King specifically)
- [ ] Pong ball (bounces across board horizontally)
- [ ] Portal tiles (teleport between linked pairs)
- [ ] Boss: **The High Score**
- [ ] CRT scanline visual filter for arcade feel

### 5.2 Tetris Abyss (R7)
- [ ] Tetromino blocks fall every N turns (preview shown)
- [ ] Blocks land on entities → destroy them
- [ ] Full row clear mechanic (like Tetris — clears a row of blocks)
- [ ] Block enemies that stack and merge
- [ ] Boss: **The Tetromancer** (fills board with blocks, clear rows to damage)

### 5.3 Craft Realm (R8)
- [ ] Resource tiles (wood, stone, iron) — collect by landing on them
- [ ] Crafting table tile — combine resources for items/upgrades
- [ ] Creeper enemies (explode near pieces), Skeleton (ranged)
- [ ] Boss: **Ender Dragon** (flies over board, build defenses + fight)

### Phase 5 Deliverable
> Eight systems active. Snake eating your pawns while Tetris blocks fall while zombies march while you're dodging mines. Peak chaos territory.

---

## 🔲 Phase 6: Regions 9–14 + Final Boss

> Late-game content. Each region is mechanically lighter (the chaos IS the difficulty).

### 6.1 Card Tower (R9) — expanded card mechanics, card enemies
### 6.2 Sports Arena (R10) — Pong/Breakout ball physics
### 6.3 Word Dungeon (R11) — Letter tiles, spell words for power
### 6.4 Number Cascade (R12) — 2048 merge mechanics
### 6.5 Imposter Station (R13) — traitor pieces, voting
### 6.6 TD Valley (R14) — tower defense turret placement

### 6.7 THE VOID — Region 15 (Final Boss)
- [ ] All 14 systems active simultaneously
- [ ] Boss: **CHAOS ITSELF** — 3 phases:
  - Phase 1: Pure chess (strips all chaos back to basics)
  - Phase 2: Adds 1 system per turn (escalating tension)
  - Phase 3: Full chaos + boss plays cards, spawns zombies, fires ships, drops blocks
- [ ] Victory screen: "You ARE the chaos now."
- [ ] Credits + unlock New Game+

> **Note:** Not every run goes through all 15 regions. The branching map means each run visits ~6–8 regions. This is critical for replayability.

---

## 🔲 Phase 7: Meta-Progression & Polish

> Make the game FEEL premium. This is what separates a prototype from a product.

### 7.1 Meta-Progression
- [ ] Between-run shop (upgrades, character unlocks, card unlocks)
- [ ] Gold earned per run → persistent currency
- [ ] Character selection (different Kings with unique abilities)
- [ ] Unlock system: cards, characters, starting bonuses
- [ ] New Game+ with modifiers and remixed bosses

### 7.2 Visual Polish
- [ ] Piece sprites (replace Unicode with actual sprites)
- [ ] Tile art per region (unique visual identity)
- [ ] Particle effects (capture explosions, mine detonation, card play)
- [ ] Screen shake on impacts
- [ ] Smooth piece movement animations (tweens, not instant teleport)
- [ ] Region-specific visual filters (CRT for arcade, neon for casino)
- [ ] Board transition animation when new system activates

### 7.3 Audio
- [ ] Per-region music (15 tracks — see GDD audio table)
- [ ] SFX: piece moves, captures, mine clicks, zombie groans, slot jingles
- [ ] Audio layering: new region = new instrument layer on the music
- [ ] Boss music per region
- [ ] Integration via Howler.js

### 7.4 UX & Accessibility
- [ ] Mobile touch controls (tap/drag for piece movement)
- [ ] Responsive layout (works on phone screens)
- [ ] How-to-play tutorial (per-region mechanic introductions)
- [ ] Settings: volume, screen size, controls
- [ ] Colorblind-friendly tile indicators
- [ ] Turn timer (optional, for PvP mode)

### 7.5 Performance
- [ ] Object pooling for entities
- [ ] Lazy system registration (only load systems for current region)
- [ ] Texture atlases for sprites
- [ ] Target: 60fps on mid-range phones

### Phase 7 Deliverable
> A polished, premium-feeling game. Everything looks, sounds, and feels great. Ready for public release.

---

## 🔲 Phase 8: Publish & Community

> Get the game in front of players.

### 8.1 itch.io Launch (Free / Pay-What-You-Want)
- [ ] Build production bundle (`npm run build`)
- [ ] Upload to itch.io with screenshots, trailer GIF, description
- [ ] Post to r/WebGames, r/IndieDev, r/roguelites
- [ ] Share devlog GIFs on Twitter/Reddit/TikTok

### 8.2 Web Portals
- [ ] Submit to CrazyGames, Poki, Newgrounds
- [ ] Optimize for their embed requirements
- [ ] Revenue share agreements

### 8.3 Desktop Build (Tauri)
- [ ] Package as native app via Tauri
- [ ] Windows + macOS + Linux builds
- [ ] Steam page setup (if traction warrants it)

### 8.4 Community
- [ ] Discord server with role-based channels
- [ ] Bug reports / feedback collection
- [ ] Changelogs and devlogs
- [ ] Streamer outreach program

---

## 🔲 Phase 9: Multiplayer (Future / Post-Launch)

> Only if the game gets traction. Do NOT build this early.

- [ ] PvP mode: shared chaos board, all systems active
- [ ] Parallel race: both players race through their own node maps
- [ ] Online via WebSocket / WebRTC
- [ ] Ranked mode with leaderboards
- [ ] Spectator mode

> **Note:** This is a "nice to have." The single-player roguelite experience is the core product. Multiplayer is stretch goal only if the game finds an audience.

---

## Key Principles

| Principle | Why |
|---|---|
| **One region at a time** | Don't build multiple systems in parallel. Finish + test one before starting the next. |
| **Architecture first** | The `GameSystem` interface exists for a reason. Every new mechanic is a plug-in. |
| **Test everything** | Each system gets unit tests. Vitest runs fast, keep the suite growing. |
| **Small commits** | Each step above should be 1–3 commits max. Verify before moving on. |
| **Playable at every phase** | After each phase, the game is playable end-to-end with current content. |
| **Don't over-scope** | Regions 6–14 are mechanically simpler than 1–5. The chaos IS the content. |
| **Screenshots sell** | Every system added should make the board look MORE insane. That's the marketing. |

---

## Estimated Timeline

| Phase | Scope | Est. Time |
|---|---|---|
| ~~Phase 0~~ | ~~Foundation~~ | ~~Done~~ |
| Phase 1 | Chess Kingdom (full region loop) | 2–3 weeks |
| Phase 2 | Minefield (first system stack) | 1 week |
| Phase 3 | Garden of the Dead (PvZ lanes) | 1–2 weeks |
| Phase 4 | Casino + Naval | 2 weeks |
| Phase 5 | Arcade + Tetris + Craft | 2–3 weeks |
| Phase 6 | Regions 9–14 + Final Boss | 3–4 weeks |
| Phase 7 | Polish, audio, mobile, UX | 2–3 weeks |
| Phase 8 | Publish + community | 1 week |
| Phase 9 | Multiplayer (stretch) | 4+ weeks |
| **Total** | | **~15–20 weeks** |

> **Reality check:** Solo dev timelines always stretch. Plan for 4–6 months. Ship Phase 1 as an early demo to get feedback. Each subsequent phase makes the game significantly more interesting — you don't need all 15 regions to have a fun game. Even 5 regions of chaos is marketable.
