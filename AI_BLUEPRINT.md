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
```

## 4. Regras de Desenvolvimento (Code Standards)

### A. Regras para JSCAD (Code-CAD)
1.  **Parametrização Obrigatória:** Todo modelo deve exportar `getParameterDefinitions` para permitir ajustes de UI.
2.  **Modularidade:** Peças complexas devem ser compostas de funções menores importadas de `/design/utils`.
3.  **Tolerâncias:** Ao usar o **Agentic Search** para buscar specs (ex: "tamanho parafuso M3"), adicione sempre uma margem de tolerância (ex: +0.2mm para furos impressos em FDM).

### B. Regras para Web (React/Three)
1.  **Carregamento Assíncrono:** Use `React.Suspense` e `useLoader` para carregar STLs.
2.  **Performance:** Configure o `<Canvas>` com sombras leves e `pixelRatio` adaptativo.
3.  **Isolamento:** O Viewer deve ser um componente genérico que aceita uma URL de STL como prop.

### C. Regras de Automação (CI/CD)
1.  **Segurança:** Use a integração do App "Access Tokens" para pushes no repo.
2.  **Idempotência:** Scripts de build só devem rodar se houver mudanças na pasta `/design`.

## 5. Roadmap de Implementação (Fases)

### Fase 1: Setup do Ambiente (Scaffolding)
*   [ ] Inicializar `package.json` na raiz com workspaces (root e web).
*   [ ] Instalar dependências JSCAD CLI e libs de modelagem.
*   [ ] Configurar Vite + React na pasta `/web`.
*   [ ] Criar script `npm run gen` que varre `/design`, compila os JS e cospe STLs em `/web/public/models`.

### Fase 2: O Primeiro Modelo (Proof of Concept)
*   [ ] Criar `/design/demo-box/index.js` (Caixa paramétrica com tampa).
*   [ ] Testar geração de STL via CLI.

### Fase 3: O Visualizador Web
*   [ ] Criar componente `STLViewer.jsx` usando `@react-three/drei/Stage`.
*   [ ] Criar interface lateral para listar arquivos na pasta `/models`.

### Fase 4: Integração de IA e CI
*   [ ] Configurar GitHub Action para rodar o build no Push.
*   [ ] Usar Gemini para validar lógica do JSCAD antes do build.

---

## 6. Instruções para Agentic Search & Models
*   **Ao pesquisar peças de hardware:** Busque sempre por "datasheet" ou "technical drawing" oficial (ex: DIN standard for screws).
*   **Ao encontrar erros:** Se o JSCAD falhar, pesquise a documentação da V2 especificamente, pois a API mudou muito recentemente.
