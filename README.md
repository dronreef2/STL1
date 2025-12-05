# MakerOS - Manufacturing as Code

![MakerOS](https://img.shields.io/badge/MakerOS-v1.0.0-blue)
![JSCAD](https://img.shields.io/badge/JSCAD-v2.3.6-green)
![React](https://img.shields.io/badge/React-18.2-61dafb)

**MakerOS** is a Code-CAD environment that brings GitOps workflows to 3D manufacturing. Design parametric 3D models using JavaScript (JSCAD), visualize them in a web browser with React Three Fiber, and automate the entire manufacturing pipeline with GitHub Actions.

## 🎯 Philosophy

**Isomorfia**: The same JavaScript code that generates your 3D models (STL/GCode) also powers the web visualization. No context switching, no dual tool chains.

## 🚀 Quick Start

### Installation

```bash
# Install root dependencies (JSCAD CLI)
npm install

# Install web dependencies
cd web && npm install && cd ..
```

### Generate 3D Models

```bash
# Generate all models from design/ folder
npm run gen

# Or build a specific model
npm run build:models
```

### Run the Web Viewer

```bash
# Start the development server
npm run web:dev

# Build for production
npm run web:build
```

## 📁 Project Structure

```
/
├── .github/workflows/   # CI/CD Pipelines
├── design/              # JSCAD Source Files
│   ├── utils/           # Reusable components (threads, snaps, etc.)
│   └── examples/        # Example models
│       └── index.js     # Simple cube example
├── web/                 # React + Vite Web Application
│   ├── public/models/   # Generated STL files (served to browser)
│   └── src/
│       ├── components/  # React components
│       │   └── Viewer3D.jsx
│       └── App.jsx
├── dist/                # Build artifacts (STL, GCode)
├── scripts/             # Build automation scripts
└── package.json         # Root package with workspaces
```

## 🛠️ Technology Stack

- **Core 3D Engine**: [JSCAD V2](https://github.com/jscad/OpenJSCAD.org)
- **Web Framework**: React 18+ (via Vite)
- **3D Visualization**: React Three Fiber + @react-three/drei
- **Styling**: TailwindCSS
- **Build/Automation**: Node.js, GitHub Actions

## 📝 Creating a New Model

1. Create a new folder in `design/` (e.g., `design/my-box/`)
2. Create an `index.js` file with JSCAD code:

```javascript
const { cuboid } = require('@jscad/modeling').primitives;
const { subtract } = require('@jscad/modeling').booleans;

const getParameterDefinitions = () => {
  return [
    { name: 'width', type: 'number', initial: 50, caption: 'Width (mm)' },
    { name: 'height', type: 'number', initial: 20, caption: 'Height (mm)' },
    { name: 'wall', type: 'number', initial: 2, caption: 'Wall (mm)' },
  ];
};

const main = (params) => {
  const outer = cuboid({
    size: [params.width, params.width, params.height]
  });

  const inner = cuboid({
    size: [
      params.width - params.wall * 2,
      params.width - params.wall * 2,
      params.height
    ]
  });

  return subtract(outer, inner);
};

module.exports = { main, getParameterDefinitions };
```

3. Generate the STL:

```bash
npm run gen
```

4. Generate documentation:

```bash
npm run docs
```

This will create a `README.md` in your design folder with:
- A formatted table of all parameters
- Links to the generated STL file

5. View in the browser at `http://localhost:3000`

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm install` | Install root dependencies |
| `npm run gen` | Generate all STL models from design/ |
| `npm run docs` | Generate README documentation for all design projects |
| `npm run build:models` | Build a specific model (examples) |
| `npm run web:dev` | Start the web development server |
| `npm run web:build` | Build the web app for production |

## 📚 Documentation

For detailed architecture and development guidelines, see [AI_BLUEPRINT.md](./AI_BLUEPRINT.md).

## 🤝 Contributing

This project is designed to work with GitHub Copilot, Agentic Search, and Gemini Code Assist. See [AI_BLUEPRINT.md](./AI_BLUEPRINT.md) for AI-specific development guidelines.

## 📄 License

MIT
