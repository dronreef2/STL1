# 🎨 STL1: Blueprint de Finalização de Frontend (Community Ready)

## 1. Objetivo
Transformar o visualizador atual em um "Portfólio de Engenharia" completo. O foco é Experiência do Usuário (UX) e Consumo de Conteúdo.

## 2. Novas Funcionalidades de Frontend
*   **Search Bar:** Filtragem em tempo real da lista de modelos na sidebar.
*   **Markdown Rendering:** O site deve buscar o `README.md` gerado para cada modelo e exibi-lo em uma aba "Instruções".
*   **Categorização:** Agrupar modelos por tags (extraídas do catalog.json se houver, ou apenas lista alfabética limpa).
*   **Deep Linking:** Ao recarregar a página com `?model=battery-holder`, o site deve abrir direto nesse modelo.

## 3. Stack Visual (Refinamento)
*   **Ícones:** `lucide-react` (para botões de Download, Info, GitHub).
*   **Markdown:** `react-markdown` + `rehype-raw` (para renderizar as tabelas de parâmetros bonitas).
*   **Layout:**
    *   **Desktop:** Sidebar (Lista/Busca) | Main (3D Viewer) | Info Panel (Tabs: Specs / Instructions).
    *   **Mobile:** Menu Hamburguer | 3D Viewer (Full) | Bottom Sheet para Info.

## 4. Definição de "Pronto"
O projeto será considerado concluído quando:
1.  Eu puder procurar uma peça pelo nome.
2.  Eu puder ler as recomendações de impressão (Infill, Material) dentro do site.
3.  O botão de download funcionar perfeitamente.
4.  O visual estiver polido (cores consistentes, sombras suaves, responsivo).
