# Contributing to MakerOS

## Guidelines for AI Agents and Contributors

### Technology Stack

1. **3D Modeling**: We use JSCAD V2 for all parametric modeling
   - API: `@jscad/modeling`
   - **Important**: Do NOT use OpenJSCAD V1 syntax
   - Always use `require('@jscad/modeling')` for imports

2. **Web Visualization**: React Three Fiber (R3F) + @react-three/drei
   - Use `React.Suspense` for async loading
   - Configure `<Canvas>` with adaptive `dpr` for performance

3. **Styling**: TailwindCSS for all UI components

### Units and Standards

- **All measurements are in millimeters (mm)**
- **Coordinate system**: Right-handed (X: width, Y: depth, Z: height)

### Tolerances for 3D Printing

When designing parts for FDM printing (PLA/PETG):

- **Clearance for moving parts**: 0.2mm - 0.3mm
- **Press-fit tolerances**: -0.1mm to -0.2mm
- **Screw holes**: Add 0.2mm to nominal diameter
  - M3 screw: 3.2mm hole
  - M4 screw: 4.2mm hole
  - M5 screw: 5.2mm hole

### Code Structure

#### JSCAD Files (`/design`)

Every model MUST follow this structure:

```javascript
const { primitives, booleans } = require('@jscad/modeling');

// Always export parameter definitions for UI
const getParameterDefinitions = () => {
  return [
    { name: 'width', type: 'number', initial: 50, caption: 'Width (mm)' },
    // ... more parameters
  ];
};

// Main function that generates the geometry
const main = (params) => {
  // Your modeling logic here
  return geometry;
};

module.exports = { main, getParameterDefinitions };
```

#### React Components (`/web/src`)

- Use functional components with hooks
- Implement `React.Suspense` for 3D model loading
- Keep components isolated and reusable

### Workflow for New Models

1. Create a new directory in `/design/[project-name]/`
2. Add `index.js` with your JSCAD code
3. Run `npm run gen` to generate STL files
4. STL files are automatically copied to `web/public/models/`
5. View in browser with `npm run web:dev`

### Searching for Hardware Specifications

When searching for standard hardware (screws, bolts, bearings):

- Search for official datasheets (e.g., "DIN 912 M3 datasheet")
- Look for technical drawings with exact dimensions
- Apply appropriate tolerances as listed above

### Testing Your Changes

```bash
# Generate models
npm run gen

# Verify STL files are created
ls -lh dist/

# Start web viewer
npm run web:dev
```

### Common Pitfalls

1. **Don't mix JSCAD V1 and V2 syntax** - Always use V2 API
2. **Don't forget tolerances** - Raw CAD dimensions won't work for 3D printing
3. **Don't commit node_modules** - Already in .gitignore
4. **Don't commit generated STL files to dist/** - These are build artifacts

### Questions?

Refer to:
- [AI_BLUEPRINT.md](./AI_BLUEPRINT.md) for architecture details
- [JSCAD V2 Documentation](https://github.com/jscad/OpenJSCAD.org)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber/)
