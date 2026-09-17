# CELAEST Constructivist Geometry Sidenav & Pure Primitive Icon System

## Architecture Standard
- **Zero Generic Clipart / App Icons**: Traditional UI icons (cogs/gears, 4-square app grids, wrench) are strictly prohibited in the Bauhaus Constructivist Sidenav.
- **Euclidean Primitives Standard**: All navigation items use strictly regular, single-primitive 2D geometric shapes:
  1. **Workspace**: Circle (`<circle cx="8" cy="8" r="6" />`)
  2. **Memory Vault**: Square (`<rect x="2" y="2" width="12" height="12" />`)
  3. **Interview**: Triangle (`<polygon points="8,2 14,14 2,14" />`)
  4. **Reading**: Diamond (`<polygon points="8,1 15,8 8,15 1,8" />`)
  5. **Writing Studio**: Hexagon (`<polygon points="8,1 14,4.5 14,11.5 8,15 2,11.5 2,4.5" />`)
  6. **Design Lab**: Orthogonal Cross (`<path d="M8 2v12M2 8h12" />`)
  7. **Settings**: Regular Octagon (`<polygon points="5.5,2 10.5,2 14,5.5 14,10.5 10.5,14 5.5,14 2,10.5 2,5.5" />`)
- **Active Fill Contract**:
  - Inactive: `fill="none"` with crisp `stroke="currentColor"` (1.5px Euclidean outline).
  - Active: `fill="currentColor"` (solid white fill) inside the CELAEST Electric Violet gradient pill (`from-[#7048e8] to-[#6038e0]`).
- **Footer Hierarchy**:
  - Pure typography: User full name + CEFR Level with generous vertical rhythm (`mt-1.5`).
  - Discrete `[SALIR]` terminal trigger button (`px-2.5 py-1 rounded`).
  - Zero generic AI clichés (no avatar bubbles with green online dots, no "PRO" tags).
