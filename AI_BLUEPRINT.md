# 🏗️ MakerOS: Blueprint de Arquitetura e Desenvolvimento

## 1. Identidade e Objetivo do Projeto
**Projeto:** MakerOS (Sistema Operacional Maker)
**Objetivo:** Criar um ambiente de "Manufatura como Código" (Code-CAD) com GitOps.
**Filosofia:** Isomorfia. O mesmo código JavaScript gera o modelo 3D (STL/GCode) e alimenta a visualização Web.
**Role da IA:** Atuar como Engenheiro Sênior Fullstack especializado em Geometria Computacional e WebGL.

## 2. Stack Tecnológico (Estrito)
Todas as gerações de código DEVEM seguir esta stack:
*   **Core 3D Engine:** [JSCAD V2](https://github.com/jscad/OpenJSCAD.org) (API `@jscad/modeling`).
    *   *Nota:* NÃO use a sintaxe antiga do OpenJSCAD V1. Use sempre `require('@jscad/modeling')`.
*   **Web Framework:** React 18+ (via Vite).
*   **Visualização Web:** React Three Fiber (R3F) + @react-three/drei + Three.js.
*   **Build/Automação:** Node.js, GitHub Actions.
*   **Estilização:** TailwindCSS (para UI rápida).

## 3. Estrutura de Diretórios Alvo
O agente deve manter rigorosamente esta estrutura:
```text
/
├── .github/workflows/   # CI/CD Pipelines
├── design/              # FONTE: Scripts JSCAD (.js)
│   ├── utils/           # Funções auxiliares (ex: threads, snaps)
│   └── [project-name]/  # Cada objeto é uma pasta
│       ├── index.js     # Entry point (deve exportar main e getParameterDefinitions)
│       └── params.json  # Valores default
├── web/                 # FONTE: Aplicação React
│   ├── public/models/   # Destino dos STLs gerados
│   └── src/components/  # Viewer3D.jsx, ParameterInputs.jsx
├── dist/                # SAÍDA: STLs e GCodes (gerados via CI ou local)
└── package.json         # Scripts de orquestração
