# Chaos Protocol — Game Design Document (GDD)

## Overview

| Field | Value |
|---|---|
| **Title** | Chaos Protocol (working title) |
| **Genre** | Roguelite Strategy / Chaotic Mashup |
| **Platform** | Browser (HTML5), Desktop (via Tauri) |
| **Players** | 1 (single-player vs AI), 2 (PvP, future) |
| **Session Length** | 30–45 minutes per full run |
| **Target Audience** | Fans of roguelites, strategy, classic game nostalgia, chaos/meme games |
| **Inspirations** | Inscryption, Slay the Spire, Bad North: Jotunn Edition, Balatro, Shotgun King |

---

## Elevator Pitch

> A roguelite where every classic game you've ever played gets stacked onto one chess board — one layer at a time. Navigate a branching node map through 15 regions, each introducing a legendary game mechanic. By the final boss, Chess, Minesweeper, PvZ, Tetris, Battleship, Snake, Poker, and more are ALL happening simultaneously on the same board. Pure chaos, earned through progression.

---

## Game Structure: The Node Map

Unlike the original "everything at once" concept, chaos **builds gradually** through a roguelite campaign.

```
╔══════════════════════════════════════════════════════╗
║                    THE NODE MAP                       ║
╠══════════════════════════════════════════════════════╣
║                                                       ║
║  REGION 1          REGION 2          REGION 3         ║
║  Chess Kingdom     Minefield         Garden of Dead   ║
║                                                       ║
║  ⚔️─⚔️─🎁─⚔️─🏰 ── ⚔️─💀─⚔️─🎁─🏰 ── ...         ║
║       \                 \                              ║
║        🔥(elite)         ❓(mystery)                   ║
║                                                       ║
║  Each region: 4-6 nodes + 1 boss                      ║
║  Player chooses path, cannot go back                   ║
║  Skipped nodes are lost forever                        ║
╚══════════════════════════════════════════════════════╝
```

### Node Types

| Icon | Type | Description |
|---|---|---|
| ⚔️ | Combat | Battle on the chaos board (current mechanics active) |
| 🔥 | Elite | Harder fight, better rewards (off main path) |
| 🎁 | Reward | Pick a card, item, upgrade, or new piece |
| 🏪 | Shop | Spend gold on permanent run upgrades |
| ❓ | Mystery | Random event — could be a blessing or curse |
| ⛺ | Rest | Heal HP or upgrade a piece (choose one) |
| 🎰 | Gamble | Risk gold/HP for rare rewards |
| 🏰 | Boss | Themed boss fight, unlocks next region |

### Path Mechanics (Bad North Style)

- See the full map at the start of each region
- **Branching paths** — choose easy (fewer rewards) or hard (better loot)
- **Cannot backtrack** — missed nodes crumble and disappear
- **Warp Tokens** — earn 1 per boss kill, spend to reach off-path nodes
- **Scout Card** — peek at one hidden node before choosing

---

## Core Loop

```
NEW RUN
  │
  ▼
REGION MAP (choose path in current region)
  │
  ▼
┌─────────────────────────────┐
│         COMBAT NODE          │
│                              │
│  1. Board generated with     │
│     current active layers    │
│  2. YOUR TURN:               │
│     - Draw card              │
│     - Move a piece           │
│     - Play a card            │
│     - Resolve tile effects   │
│  3. ENEMY PHASE:             │
│     - AI moves pieces        │
│     - Lane enemies advance   │
│     - Random events fire     │
│  4. CHECK CONDITIONS:        │
│     - King dead? → Lose      │
│     - All enemies dead? → Win│
│  5. Repeat until resolved    │
└──────────────┬──────────────┘
               │
               ▼
         NODE REWARDS
         (cards, gold, items)
               │
               ▼
    NEXT NODE (choose path)
               │
               ▼
         BOSS NODE
     (beat → unlock next region)
               │
               ▼
       NEXT REGION
    (new mechanic stacks on)
               │
               ▼
    ... until FINAL BOSS ...
               │
               ▼
┌─────────────────────────────┐
│          RUN END             │
│                              │
│  Score, gold earned, stats   │
│  Meta-upgrades shop          │
│  Unlock new characters/cards │
│  Start new run (stronger)    │
└─────────────────────────────┘
```

---

## Region Progression Summary

Each region introduces ONE new game mechanic that persists for the rest of the run.

| # | Region | New Mechanic | Boss |
|---|---|---|---|
| 1 | ♟️ Chess Kingdom | Chess movement + capture | The Grandmaster |
| 2 | 💣 Minefield | Minesweeper fog + mines | The Mine King |
| 3 | 🌻 Garden of the Dead | PvZ lanes + plantable pawns | Zombie Overlord |
| 4 | 🎰 Casino Strip | Slots + gambling + chests | The House |
| 5 | 🚢 Naval Fortress | Battleship + water terrain | Admiral Ironclad |
| 6 | 🐍 Arcade Ruins | Snake + Pac-Man ghost + Pong ball | The High Score |
| 7 | 🧱 Tetris Abyss | Falling Tetris blocks | The Tetromancer |
| 8 | ⛏️ Craft Realm | Resources + crafting + structures | Ender Dragon |
| 9 | 🃏 Card Tower | Expanded cards + card enemies | The Dealer |
| 10 | 🎯 Sports Arena | Balls + Breakout bricks + physics | The Champion |
| 11 | 🔤 Word Dungeon | Letter tiles + spell words | The Lexicon |
| 12 | 🔢 Number Cascade | 2048 merge + math enemies | The Infinite |
| 13 | 🕵️ Imposter Station | Traitor pieces + voting | The Imposter |
| 14 | 🏗️ TD Valley | Tower placement + upgrade paths | Siege Engine |
| 15 | 💀 THE VOID | Everything at once | CHAOS ITSELF |

> **Note:** A single run won't go through ALL 15 regions. The map branches, so each run visits ~6–8 regions before the final boss. This ensures replayability — different paths = different chaos combos each run.

---

## Board Layout

The board is dynamic and changes per region, but the base is always a grid:

- **Region 1–3:** 8x8 grid (chess standard)
- **Region 4–8:** 10x10 grid (more room for additional systems)
- **Region 9–14:** 10x10 or 12x12 (scaling with complexity)
- **Final Boss:** 12x12 with all tile types active

### Tile Types (Cumulative — Unlocked by Region)

| Tile | Unlocked | Symbol | Behavior |
|---|---|---|---|
| Normal | R1 | ▪ | Standard movement |
| Mine | R2 | 💣 | Damages piece that reveals it |
| Fog | R2 | ?? | Hidden tile, click to reveal |
| Number | R2 | 1–8 | Adjacent mine count |
| Sunflower | R3 | 🌻 | +1 card draw per turn |
| Turret | R3 | 🏗️ | Auto-attacks down its lane |
| Slot | R4 | 🎰 | Random spin: buff or debuff |
| Chest | R4 | 🎁 | Loot or mimic |
| Water | R5 | 🌊 | Impassable |
| Ship | R5 | 🚢 | Hidden, fire to reveal |
| Gem | R6 | 💎 | Collectable resource |
| Block | R7 | 🧱 | Destructible Tetris debris |
| Resource | R8 | ⛏️ | Wood/stone/iron for crafting |
| Letter | R11 | 🔤 | Collect to spell words |
| Portal | R6 | 🌀 | Teleport between linked tiles |

---

## Pieces

### Chess Pieces (Base — Region 1)

| Piece | Movement | Region Special |
|---|---|---|
| King | 1 tile any direction | Must survive — death = run over |
| Queen | Any distance, any direction | R5: Can fire battleship shots |
| Rook | Any distance, horizontal/vertical | R14: Can deploy turrets |
| Bishop | Any distance, diagonal | R2: Safely reveals adjacent fog |
| Knight | L-shape (2+1) | R2: Jumps mines without triggering |
| Pawn | 1 fwd (2 first), capture diagonal | R3: Can be planted as PvZ unit |

### PvZ Plants (Region 3+)

| Plant | Cost | Effect |
|---|---|---|
| Sunflower | Free | +1 card draw/turn |
| Peashooter | 1 card | Shoots down its lane |
| Wall-Nut | 1 card | Blocks lane enemies |
| Cherry Bomb | 2 cards | 3x3 explosion, single use |
| Snow Pea | 2 cards | Shoots + slows enemies |

---

## Cards

Draw 1 per turn. Hold max 5. New cards unlocked as you discover regions.

### Base Cards (Region 1)

| Card | Effect |
|---|---|
| Swap | Switch two piece positions |
| Shield | Protect piece 1 turn |
| Double Move | Move twice this turn |

### Region-Specific Cards (Examples)

| Card | Region | Effect |
|---|---|---|
| Reveal | R2 | Safely show one fog tile |
| Board Scan | R2 | Reveal mines in 3x3 |
| Nuke Row | R3 | Destroy all in a row |
| Resurrect | R3 | Revive a captured piece |
| Gamble | R4 | Draw 2, discard 1 random |
| Cannon Fire | R5 | Fire at any tile |
| Power Pellet | R6 | Reverse enemy movement 3 turns |
| Block Drop | R7 | Drop tetromino on enemies |
| Craft | R8 | Combine resources into item |
| Wild Card | R9 | Becomes any card |
| Spell Word | R11 | Type a word for power effect |
| Merge | R12 | Combine two adjacent pieces |
| Eject | R13 | Vote to remove a piece (ally or traitor) |
| Deploy Turret | R14 | Place a fixed turret |
| Time Rewind | Any | Undo last 3 turns (rare) |
| Board Flip | Any | Rotate board 180° (legendary) |

---

## Enemies

Enemies are cumulative — later regions add new types alongside existing ones.

### Region-Specific Enemies

| Region | Enemy | HP | Behavior |
|---|---|---|---|
| R1 | Chess AI | Varies | Standard chess pieces |
| R2 | Mine Golem | 2 | Immune to mines, places new ones |
| R3 | Walker Zombie | 1 | Walks 1 tile/turn toward you |
| R3 | Runner Zombie | 1 | Walks 2 tiles/turn |
| R3 | Tank Zombie | 3 | Slow, high HP |
| R3 | Bomber Zombie | 1 | Explodes on death, 3x3 damage |
| R4 | Card Dealer | 2 | Plays debuff cards |
| R5 | Admiral Piece | 2 | Fires cannons every 2 turns |
| R6 | Pac-Ghost | 1 | Chases your King specifically |
| R7 | Block Stack | Variable | Merges with adjacent blocks |
| R8 | Creeper | 1 | Explodes when adjacent |
| R8 | Skeleton | 1 | Ranged attacks |
| R9 | Card Jack | 1 | Fast, 2 moves/turn |
| R9 | Card Queen | 2 | Heals adjacent enemies |
| R11 | Anagram | 2 | Scrambles your collected letters |
| R12 | Splitter | 1→2 | Splits into 2 weaker enemies on death |
| R13 | Imposter | ? | Looks like your piece, sabotages |
| R14 | Siege Ram | 5 | Fixed path, ignores captures, only turrets damage |

---

## Meta-Progression (Between Runs)

| Upgrade | Cost | Effect |
|---|---|---|
| Extra card slot | 100g | Hold 6 cards instead of 5 |
| Mine detector | 150g | Start with 2 revealed mines per battle |
| Better odds | 200g | Slot machines +20% positive outcomes |
| Stronger pawns | 100g | Pawns +1 HP |
| Starting hand | 250g | Draw 2 cards at start instead of 0 |
| Warp Token +1 | 300g | Start each run with an extra warp token |
| Unlock character | 500g | New King with unique ability |
| Region shortcut | 400g | Unlock ability to skip first 2 regions |

---

## Audio Design

| Region | Music Style | Key SFX |
|---|---|---|
| Chess Kingdom | Classical/orchestral | Wooden piece clicks |
| Minefield | Tense ambient, ticking | Beeps, explosions |
| Garden | Cheerful/quirky PvZ-style | Planting squish, zombie groans |
| Casino | Jazz/lounge | Slot jingles, coin clinks, card flips |
| Naval | Military drums, sea ambience | Cannon fire, water splashes |
| Arcade | 8-bit chiptune | Retro bleeps, pac-man wakka |
| Tetris | Synthwave/electronic | Block drops, row clears |
| Craft | Calm ambient/C418-style | Mining, crafting, explosion |
| Card Tower | Mysterious jazz | Card whooshes, dealing sounds |
| Sports | Stadium energy, drums | Crowd cheers, ball bounces |
| Word Dungeon | Eerie library ambience | Typewriter clicks, page turns |
| Number Cascade | Minimal electronic | Merge whoosh, calculator beeps |
| Imposter Station | Suspenseful synth | Alarm klaxons, vent sounds |
| TD Valley | Medieval fanfare | Arrow shots, construction |
| THE VOID | Distorted mix of ALL above | Glitching, overlapping chaos |
