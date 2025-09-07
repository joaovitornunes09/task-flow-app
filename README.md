# Task Flow App

Uma aplicação moderna de gerenciamento de tarefas construída com Vue.js 3, TypeScript, Tailwind CSS e Pinia. Este frontend integra com a API Task Flow para fornecer uma solução abrangente de gerenciamento de tarefas com autenticação de usuário, organização de tarefas, recursos de colaboração e funcionalidades de relatório.

## ✨ Funcionalidades Implementadas

### ✅ Funcionalidades Concluídas

1. **Configuração do Projeto & Arquitetura**
   - Vue 3 com suporte a TypeScript
   - Vite para desenvolvimento e build rápidos
   - Tailwind CSS para estilização responsiva
   - Componentes de UI inspirados no ShadCN-Vue
   - Pinia para gerenciamento de estado
   - Vue Router para navegação

2. **Sistema de Autenticação**
   - Registro e login de usuários
   - Gerenciamento de token JWT
   - Rotas protegidas com auth guards
   - Estado de autenticação persistente

3. **Integração com API**
   - Camada de serviço completa para API
   - Interceptadores Axios para gerenciamento de token
   - Chamadas de API tipadas com interfaces TypeScript
   - Tratamento de erros e estados de carregamento

4. **Roteamento & Layout**
   - Navegação responsiva com menu mobile
   - Rotas protegidas e exclusivas para convidados
   - Layout limpo e moderno
   - Menu dropdown de usuário

5. **Dashboard**
   - Visão geral de estatísticas de tarefas
   - Botões de ações rápidas
   - Exibição de tarefas recentes
   - Design responsivo

### 🚧 Funcionalidades Planejadas (Prontas para Implementação)

6. **Gerenciamento de Tarefas (CRUD)**
   - Criar, editar e excluir tarefas
   - Acompanhamento de status da tarefa (TODO, IN_PROGRESS, COMPLETED)
   - Níveis de prioridade (BAIXA, MÉDIA, ALTA)
   - Gerenciamento de prazos

7. **Sistema de Categorias**
   - Criar e gerenciar categorias de tarefas
   - Categorias com cores diferenciadas
   - Filtro de tarefas por categoria

8. **Recursos de Colaboração**
   - Adicionar colaboradores às tarefas
   - Permissões baseadas em papéis (OWNER, COLLABORATOR, VIEWER)
   - Gerenciamento de tarefas em equipe

9. **Relatórios & Análises**
   - Relatórios de produtividade do usuário
   - Métricas de desempenho da equipe
   - Rastreamento de conclusão de tarefas
   - Gráficos e visualizações

10. **UI/UX Avançada**
    - Filtros e ordenação avançados
    - Melhorias de acessibilidade

## 🚀 Começando

### Pré-requisitos

- Node.js (v16 ou superior)
- pnpm (recomendado) ou npm
- API Task Flow rodando em `http://localhost:3333`

### Instalação

1. Clone e acesse o projeto:
   ```bash
   cd task-flow-app

2. Instale as dependências:
   ```bash
   pnpm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm run dev
   ```

4. Abra seu navegador e acesse a URL fornecida (geralmente `http://localhost:5175`)

### Scripts Disponíveis

- `pnpm run dev` - Inicia o servidor de desenvolvimento
- `pnpm run build` - Gera o build para produção
- `pnpm run preview` - Visualiza o build de produção
- `pnpm run typecheck` - Executa verificação de tipos do TypeScript
- `pnpm run lint` - Executa linting (placeholder)

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── ui/              # Componentes reutilizáveis de UI (Button, Input, Card, etc.)
│   └── AppLayout.vue    # Layout principal da aplicação
├── views/               # Componentes de páginas
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   ├── DashboardView.vue
│   ├── TasksView.vue
│   ├── CategoriesView.vue
│   ├── CollaborationsView.vue
│   ├── ReportsView.vue
│   └── ProfileView.vue
├── stores/              # Stores do Pinia
│   ├── auth.ts          # Estado de autenticação
│   ├── tasks.ts         # Estado de gerenciamento de tarefas
│   └── categories.ts    # Estado de gerenciamento de categorias
├── services/
│   └── api.ts           # Camada de serviço da API
├── types/
│   └── index.ts         # Definições de tipos do TypeScript
├── utils/
│   └── cn.ts            # Utilitário de classes CSS
├── router/
│   └── index.ts         # Configuração do Vue Router
└── assets/
    └── css/
        └── main.css     # Estilos globais e imports do Tailwind
```

## 🔧 Stack Tecnológico

- **Framework Frontend:** Vue.js 3 (Composition API)
- **Linguagem:** TypeScript
- **Ferramenta de Build:** Vite
- **Estilização:** Tailwind CSS
- **Gerenciamento de Estado:** Pinia
- **Roteamento:** Vue Router
- **Cliente HTTP:** Axios
- **Componentes de UI:** Custom components inspired by ShadCN-Vue
- **Ícones:** Lucide Vue Next
- **Gerenciador de Pacotes:** pnpm

## 🌐 Integração com API

O frontend integra com a API Task Flow através dos seguintes endpoints:

### Gerenciamento de Usuários
- `POST /users/register` - Registro de usuário
- `POST /users/login` - Autenticação de usuário
- `GET /users/profile` - Obter perfil do usuário
- `PUT /users/profile` - Atualizar perfil do usuário
- `GET /users` - Obter todos os usuários

### Gerenciamento de Tarefas
- `GET /tasks` - Obter tarefas do usuário
- `POST /tasks` - Criar nova tarefa
- `GET /tasks/:id` - Obter tarefa por ID
- `PUT /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Excluir tarefa
- `GET /tasks/assigned` - Obter tarefas atribuídas
- `GET /tasks/category/:categoryId` - Obter tarefas por categoria
- `GET /tasks/status/:status` - Obter tarefas por status

### Categorias
- `GET /categories` - Obter categorias do usuário
- `POST /categories` - Criar nova categoria
- `GET /categories/:id` - Obter categoria por ID
- `PUT /categories/:id` - Atualizar categoria
- `DELETE /categories/:id` - Excluir categoria

### Colaboração
- `POST /collaborations` - Adicionar colaborador
- `GET /collaborations/task/:taskId` - Obter colaboradores da tarefa
- `GET /collaborations/user` - Obter colaborações do usuário
- `DELETE /collaborations/task/:taskId/user/:userId` - Remover colaborador
- `GET /collaborations/permission/:taskId` - Verificar permissões

### Relatórios
- `GET /reports/user` - Obter relatório do usuário
- `POST /reports/team` - Obter relatório da equipe
- `GET /reports/completed-tasks` - Obter relatório de tarefas concluídas

## 📝 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE_URL=http://localhost:3333
```
