# Chaos Protocol — Development Plan

> *"Every classic game you know — stacked onto one board, one region at a time."*

## Vision

A roguelite strategy game with a branching node-map campaign. Each region introduces a legendary classic game mechanic to the chaos board. Navigate paths (Bad North-style: no backtracking, limited warp tokens for off-path nodes). By the final boss, everything is active at once.

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Engine | **Phaser 3** | Best HTML5 2D game framework, huge community |
| Language | **TypeScript** | Type safety, great with Phaser |
| Build | **Vite** | Fast HMR, modern tooling |
| State | **In-memory + LocalStorage** | Save progression between sessions |
| Audio | **Howler.js** | Simple, reliable web audio |
| Hosting | **itch.io / GitHub Pages** | Free, instant deployment |

---

## Development Phases

### Phase 1: Core Engine + Region 1 (Chess Kingdom) — Week 1–2

Build the foundation: board, pieces, turns, and the node map.

- [ ] Project setup (Vite + Phaser 3 + TypeScript)
- [ ] **Node Map System:**
  - [ ] Region map rendering (nodes + paths)
  - [ ] Node types (combat, reward, shop, mystery, rest, boss)
  - [ ] Path selection with no backtracking
  - [ ] Warp Token system (off-path node access)
  - [ ] Transition animations between nodes
- [ ] **Board System:**
  - [ ] 8x8 grid rendering with tile types
  - [ ] Click-to-select, click-to-move interface
  - [ ] Legal move highlighting
- [ ] **Chess Pieces:**
  - [ ] King, Queen, Rook, Bishop, Knight, Pawn
  - [ ] Movement validation for all piece types
  - [ ] Piece capture logic
- [ ] **Turn System:**
  - [ ] Player → Enemy → repeat
  - [ ] Basic AI opponent (legal random moves)
- [ ] **Win/Lose:**
  - [ ] King captured = game over
  - [ ] All enemy pieces captured = win
- [ ] **Region 1 Boss: The Grandmaster**
  - [ ] Smarter AI (prioritizes captures, protects King)
- [ ] Game Over screen with stats + gold earned
- [ ] Basic card system: 3 starter cards (Swap, Shield, Double Move)

**Deliverable:** Playable node-map → chess battles → boss fight

---

### Phase 2: Region 2 (Minefield) — Week 3

- [ ] **Minesweeper fog zone added to boards:**
  - [ ] Fog tiles (hidden until revealed)
  - [ ] Number tiles (show adjacent mine count)
  - [ ] Mine tiles (damage/destroy pieces)
  - [ ] New board generation: chess + mines mixed
- [ ] **New cards:** Reveal, Board Scan
- [ ] **New enemy:** Mine Golem (immune to mines, places new ones)
- [ ] **Bishop special:** safely reveals adjacent fog
- [ ] **Knight special:** jumps mines without triggering
- [ ] **Region 2 Boss: Mine King** (80% mined board)
- [ ] Region hazard: random mines appear on all R2 combat nodes
- [ ] **New node type: ❓ Mystery** (random events)

**Deliverable:** Chess + Minesweeper hybrid with node map

---

### Phase 3: Region 3 (Garden of the Dead) — Week 4

- [ ] **PvZ lane system:**
  - [ ] Enemies spawn at far side, walk toward player
  - [ ] Lane overlay on chess grid
  - [ ] Wave system (harder every few turns)
- [ ] **Pawn planting:**
  - [ ] Sunflower (resource), Peashooter (attack), Wall-Nut (defense)
  - [ ] Cherry Bomb (AoE), Snow Pea (slow)
- [ ] **New enemies:** Walker, Runner, Tank, Bomber, Healer, Ghost
- [ ] **New cards:** Nuke Row, Resurrect
- [ ] **Region 3 Boss: Zombie Overlord** (survive 15 waves)
- [ ] Region hazard: zombie spawns on all R3 nodes

**Deliverable:** Chess + Mines + PvZ lanes

---

### Phase 4: Region 4 (Casino Strip) — Week 5

- [ ] **Gambling tiles:**
  - [ ] Slot machines (land → spin → outcome)
  - [ ] Chests (loot or mimic)
  - [ ] Betting system (wager for better rewards)
- [ ] **Slot machine outcomes table (6 outcomes)**
- [ ] **New enemy:** Card Dealer (plays debuff cards)
- [ ] **New cards:** Gamble
- [ ] **Region 4 Boss: The House** (everything is rigged)
- [ ] **New node type: 🎰 Gamble Node**
- [ ] Region hazard: 20% chance rewards are cursed

**Deliverable:** Chess + Mines + PvZ + Gambling

---

### Phase 5: Region 5 (Naval Fortress) — Week 6

- [ ] **Battleship system:**
  - [ ] Hidden ships placed on board
  - [ ] Fire action (instead of moving a piece)
  - [ ] Hit/Miss → reveal or create water
  - [ ] Water tiles (impassable)
- [ ] **New enemy:** Admiral Piece (ranged cannon attacks)
- [ ] **Queen special:** can fire battleship shots
- [ ] **New cards:** Cannon Fire
- [ ] **Region 5 Boss: Admiral Ironclad** (massive hidden fleet)
- [ ] Region hazard: water tiles on all R5 boards

**Deliverable:** 5 systems stacked — feels properly chaotic

---

### Phase 6: Regions 6–8 (Arcade, Tetris, Craft) — Week 7–8

Build these three smaller-scope regions:

- [ ] **Region 6: Arcade Ruins**
  - [ ] Snake entity (roams, eats gems, kills pieces)
  - [ ] Pac-Man ghost (chases King)
  - [ ] Pong ball (bounces across board)
  - [ ] Boss: The High Score
- [ ] **Region 7: Tetris Abyss**
  - [ ] Tetromino blocks fall every N turns
  - [ ] Full row clear mechanic
  - [ ] Block enemies (stack and merge)
  - [ ] Boss: The Tetromancer
- [ ] **Region 8: Craft Realm**
  - [ ] Resource tiles (wood, stone, iron)
  - [ ] Crafting table tile (combine resources)
  - [ ] Creeper + Skeleton enemies
  - [ ] Boss: Ender Dragon

---

### Phase 7: Regions 9–14 + Final Boss — Week 9–11

- [ ] **Region 9: Card Tower** (expanded card system, card enemies)
- [ ] **Region 10: Sports Arena** (Pong, Breakout, ball physics)
- [ ] **Region 11: Word Dungeon** (Wordle/Scrabble letter tiles)
- [ ] **Region 12: Number Cascade** (2048 merge, math enemies)
- [ ] **Region 13: Imposter Station** (Among Us mechanics)
- [ ] **Region 14: TD Valley** (tower defense, turret placement)
- [ ] **Region 15: THE VOID**
  - [ ] All systems active simultaneously
  - [ ] Multi-phase boss: CHAOS ITSELF
  - [ ] Phase 1: Pure chess (strips chaos)
  - [ ] Phase 2: Adds one system per turn
  - [ ] Phase 3: Full chaos

---

### Phase 8: Meta-Progression & Polish — Week 12–13

- [ ] **Between-run shop:** upgrades, character unlocks, card unlocks
- [ ] **Visual polish:** particles, screen shake, smooth animations
- [ ] **Audio:** per-region music + SFX (see GDD)
- [ ] **Mobile support:** touch controls, responsive layout
- [ ] **Main menu, settings, how-to-play tutorial**
- [ ] **Run summary screen** with shareable screenshot
- [ ] **Achievements system**

---

### Phase 9: Multiplayer (Future)

- [ ] PvP mode (shared chaos board, all systems active)
- [ ] Parallel run race (both players race through node maps)
- [ ] Online via WebSocket / WebRTC
- [ ] Ranked mode with leaderboards
- [ ] Spectator mode

---

## Project Structure

```
chaos-game/
├── docs/                        # Documentation
├── public/
│   ├── assets/
│   │   ├── sprites/             # Pieces, enemies, tiles, cards, bosses
│   │   ├── audio/               # Per-region music + SFX
│   │   └── fonts/
│   └── favicon.ico
├── src/
│   ├── main.ts                  # Entry point, Phaser config
│   ├── scenes/
│   │   ├── BootScene.ts         # Asset preloading
│   │   ├── MenuScene.ts         # Main menu
│   │   ├── NodeMapScene.ts      # ★ Region node map navigation
│   │   ├── GameScene.ts         # Core board gameplay
│   │   ├── BossScene.ts         # Boss encounters (special rules)
│   │   ├── RewardScene.ts       # Card/item selection
│   │   ├── ShopScene.ts         # Between-run upgrades
│   │   ├── GameOverScene.ts     # Run results
│   │   └── RunSummaryScene.ts   # Shareable end-of-run card
│   ├── map/
│   │   ├── NodeMap.ts           # ★ Map generation & path logic
│   │   ├── MapNode.ts           # Node types & data
│   │   ├── RegionConfig.ts      # Per-region settings & hazards
│   │   └── WarpToken.ts         # Off-path access system
│   ├── board/
│   │   ├── Board.ts             # Grid management
│   │   ├── Tile.ts              # All tile types
│   │   └── BoardGenerator.ts    # Generate boards per region
│   ├── pieces/
│   │   ├── ChessPiece.ts        # Base chess piece
│   │   ├── PvZPlant.ts          # Planted variants
│   │   └── PieceFactory.ts
│   ├── enemies/
│   │   ├── Enemy.ts             # Base enemy
│   │   ├── EnemyFactory.ts      # Spawn by region
│   │   └── WaveManager.ts
│   ├── cards/
│   │   ├── Card.ts              # Base card
│   │   ├── CardDeck.ts          # Draw/discard
│   │   └── CardEffects.ts       # Per-card effects
│   ├── systems/
│   │   ├── TurnManager.ts       # Turn order & phases
│   │   ├── MinesweeperSystem.ts # R2+
│   │   ├── LaneSystem.ts        # R3+ (PvZ)
│   │   ├── GamblingSystem.ts    # R4+
│   │   ├── BattleshipSystem.ts  # R5+
│   │   ├── ArcadeSystem.ts      # R6+ (Snake, PacMan, Pong)
│   │   ├── TetrisSystem.ts      # R7+
│   │   ├── CraftSystem.ts       # R8+
│   │   ├── WordSystem.ts        # R11+
│   │   ├── MergeSystem.ts       # R12+
│   │   ├── ImposterSystem.ts    # R13+
│   │   ├── TowerDefenseSystem.ts# R14+
│   │   └── ProgressionSystem.ts # Meta-upgrades
│   ├── bosses/
│   │   ├── Boss.ts              # Base boss
│   │   └── BossFactory.ts       # Per-region boss logic
│   ├── ai/
│   │   ├── BasicAI.ts           # Normal combat AI
│   │   └── BossAI.ts            # Boss-specific AI
│   ├── ui/
│   │   ├── HUD.ts               # Turn counter, HP, scores
│   │   ├── CardHand.ts          # Player card hand
│   │   ├── SlotMachine.ts       # Spin animation
│   │   └── NodeMapUI.ts         # Map navigation UI
│   └── utils/
│       ├── SaveManager.ts       # LocalStorage persistence
│       ├── ObjectPool.ts        # Performance
│       └── Constants.ts         # Config values
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Success Criteria for v0.1 (Phase 1)

- [ ] Node map renders with clickable path choices
- [ ] Chess battles play correctly (all piece types)
- [ ] Card system works (draw, hold, play)
- [ ] Basic AI makes legal moves
- [ ] Boss fight has increased difficulty
- [ ] Win/lose conditions work
- [ ] Gold earned → visible in between-battle UI
- [ ] Game runs at 60fps in Chrome/Firefox/Safari
- [ ] Touch input works on mobile
