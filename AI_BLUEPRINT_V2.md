# ☁️ MakerOS V2: Arquitetura Híbrida (Cloud-Native)

## 1. Visão Estratégica (V2.0)
**Objetivo:** Transformar o MakerOS de um gerador estático local em uma plataforma SaaS pessoal (Software as a Service) para gestão de ativos digitais 3D.
**Mudança de Paradigma:**
*   **Antes (V1):** Source of Truth era apenas o código local (`/design`).
*   **Agora (V2):** Source of Truth é Híbrida -> Código Local (GitHub) + Ativos Binários (Supabase Cloud).

## 2. Stack Tecnológica Adicional
*   **Backend as a Service:** Supabase (Database + Storage + Auth).
*   **Frontend State:** React Query (ou SWR) para gerenciar dados remotos.
*   **Integração:** `@supabase/supabase-js`.

## 3. Estratégia de Armazenamento (Storage Policy)
Para respeitar os limites do GitHub e otimizar performance:
1.  **Code-CAD (JSCAD):** Continua no **GitHub**. É texto leve, versionável e renderizável.
2.  **Assets Binários (STLs/OBJs baixados):** Vão para o **Supabase Storage**.
    *   *Motivo:* Evita bloat do repositório Git (Git não lida bem com binários grandes).
    *   *Limite:* Supabase Free Tier oferece 1GB (aprox. 50-100 arquivos complexos).
3.  **Metadados:** Banco de dados PostgreSQL (Supabase) unifica as referências.

## 4. Roadmap de Implementação V2

### Fase 2.1: Infraestrutura de Backend (Supabase Setup)
*   [ ] Configurar Cliente Supabase no Frontend (`lib/supabaseClient.js`).
*   [ ] Definir Schema SQL:
    *   Tabela `assets` (id, title, description, storage_url, file_size, origin_url, tags).
*   [ ] Criar Página de Upload (`/upload`):
    *   Interface Drag & Drop.
    *   Upload direto para bucket `3d-models`.
    *   Insert de metadados na tabela `assets`.

### Fase 2.2: O Catálogo Unificado
*   [ ] Refatorar `App.jsx` para buscar dados de duas fontes:
    1.  `catalog.json` (Gerado localmente pelo CI).
    2.  `supabase.from('assets').select('*')` (Nuvem).
*   [ ] Unificar listas na UI com indicadores visuais (Badge: "Code-Generated" vs "Cloud-Asset").

### Fase 2.3: Autenticação e Segurança
*   [ ] Implementar Supabase Auth (GitHub Provider).
*   [ ] Proteger a rota `/upload` (Somente usuário autenticado pode subir arquivos).
*   [ ] Configurar Row Level Security (RLS) no banco de dados.

### Fase 2.4: Preparação para V3 (Cloud Slicing & Web Edit)
*   [ ] Estruturar o visualizador para aceitar URLs remotas (CORS habilitado).
*   [ ] Estudar integração do `@jscad/web` para edição em tempo real.

## 5. Regras de Desenvolvimento V2
1.  **Segurança de Chaves:** NUNCA comitar `SUPABASE_KEY` no código. Use variáveis de ambiente (`.env.local` e GitHub Secrets).
2.  **Fallback Gracioso:** Se o Supabase estiver offline ou sem chaves, o site deve continuar funcionando apenas com os modelos locais (V1).
