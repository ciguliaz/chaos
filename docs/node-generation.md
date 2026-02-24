# Node Generation Strategy

> How the node map is generated for each run/region.

---

## Inspiration: Inscryption's Map

Inscryption uses a **branching vertical path** where:
- Nodes are laid out in **rows** (tiers), typically 3–4 columns wide
- Each row has 2–4 nodes connected to the next row's nodes
- The player picks ONE node per row, advancing upward
- Cannot backtrack — skipped paths are gone
- Each run is unique due to random node type/placement

Our game follows this model but starts simpler and scales up.

---

## V1: Linear (Current — Region 1)

```
[Battle I] → [Battle II] → [Battle III] → [★ Elite] → [👑 Boss]
```

- **5 consecutive nodes**, all in a single column
- First node starts as `Available`, rest are `Locked`
- Completing a node unlocks the next one
- Node types: 3 combat + 1 elite + 1 boss

**Why:** Get the full run loop working (menu → map → combat → map) before adding branching complexity.

---

## V2: Simple Branching (Target for Region 2+)

```
         [Battle I]
          /      \
    [Battle II] [Mystery]
          \      /
        [Battle III]
          /      \
     [Elite]   [Rest]
          \      /
          [Boss]
```

- **5 tiers** (rows), each with 1–2 nodes
- Player chooses one node per tier
- Paths converge before the boss (guaranteed boss encounter)
- Random node type assignment per tier:
  - Tier 1: Always combat (tutorial fight)
  - Tier 2–3: Combat, Mystery, Reward (random)
  - Tier 4: Elite or Rest
  - Tier 5: Always Boss

### Generation Algorithm

```
1. Define tiers = [1, 2, 2, 2, 1] (nodes per tier)
2. For each tier, randomly assign node types from the tier's pool
3. Connect each node to 1–2 nodes in the next tier
4. First tier's node(s) = Available, rest = Locked
```

---

## V3: Full Inscryption-Style (Target for Region 5+)

```
           [Start]
          /   |   \
     [⚔️] [❓] [🏪]
      |  \  / \  |
     [⚔️] [🔥] [⛺]
      |  \  |  / |
     [⚔️] [⚔️] [🎰]
         \  |  /
          [🏰]
```

- **6–8 tiers**, 2–4 nodes wide
- Multiple valid paths through the map
- Off-path nodes accessible via **Warp Tokens** (earned from bosses)
- Each path has a risk/reward tradeoff:
  - Safe path: combat → rest → combat → boss
  - Greedy path: elite → mystery → gamble → boss
- Skipped nodes visually "crumble" on the map (satisfying)

### Generation Rules

1. **Tier pools:**

| Tier | Node Pool | Notes |
|---|---|---|
| 1 | Combat only | Easy intro fight |
| 2–3 | Combat (60%), Mystery (15%), Reward (15%), Shop (10%) | Core progression |
| 4–5 | Combat (40%), Elite (20%), Rest (20%), Mystery (10%), Gamble (10%) | Ramp up |
| 6–7 | Combat (30%), Elite (30%), Rest (20%), Shop (20%) | Pre-boss prep |
| Final | Boss only | Region boss |

2. **Connection rules:**
   - Each node connects to 1–2 nodes in the next tier
   - No orphan nodes (every node must be reachable)
   - All paths converge at the boss

3. **Constraints:**
   - At least 1 rest node per region
   - At most 2 elite nodes per region
   - Exactly 1 boss node (always final tier)
   - Shop appears at most once

---

## Future Ideas

- **Dynamic difficulty:** If the player is losing, generate easier paths (fewer elites, more rests)
- **Region-specific nodes:** Minefield region spawns "Mine Detector" reward nodes, Casino region spawns "Gamble" nodes
- **Seed-based generation:** Shareable run seeds for speedrun/competitive play
- **Boss preview:** Show the boss icon at the top of the map from the start — the ominous destination
