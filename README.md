# Task Flow App

Uma aplicação moderna e profissional de gerenciamento de tarefas construída com Vue.js 3, TypeScript, Tailwind CSS e Pinia. Este frontend integra-se perfeitamente com a API Task Flow para fornecer uma solução completa de gerenciamento de tarefas com autenticação de usuários, organização de tarefas, ferramentas de colaboração e relatórios detalhados.

## ✨ Principais Funcionalidades

### Funcionalidades Principais
- **Arquitetura Moderna**: Construída com Vue 3 Composition API, TypeScript e Vite para performance otimizada
- **Design Responsivo**: Abordagem mobile-first com Tailwind CSS garantindo experiência perfeita em todos os dispositivos
- **Sistema de Autenticação**: Autenticação segura baseada em JWT com gerenciamento de sessão persistente
- **Gerenciamento de Tarefas**: Operações CRUD completas com rastreamento de status, níveis de prioridade e gerenciamento de prazos
- **Organização por Categorias**: Sistema de categorização com cores para melhor organização das tarefas
- **Colaboração em Equipe**: Permissões baseadas em papéis (Proprietário, Colaborador, Visualizador) para gerenciamento de tarefas em equipe
- **Relatórios e Análises**: Relatórios de produtividade abrangentes com representação visual de dados
- **Atualizações em Tempo Real**: Atualizações dinâmicas da interface com estados de carregamento otimistas

### Destaques Técnicos
- **Segurança de Tipos**: Integração completa com TypeScript e definições de tipos abrangentes
- **Gerenciamento de Estado**: Gerenciamento centralizado de estado usando stores Pinia
- **Integração com API**: Cliente HTTP robusto com interceptadores e tratamento de erros
- **Biblioteca de Componentes**: Componentes UI customizados inspirados em sistemas de design modernos
- **Acessibilidade**: Interface compatível com WCAG e suporte para navegação por teclado

## 🚀 Início Rápido

### Pré-requisitos
- Docker e Docker Compose
- Git

### Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/joaovitornunes09/task-flow-app.git
   cd task-flow-app
   ```

2. **Configure o ambiente:**
   ```bash
   cp .env.example .env
   ```

3. **Inicie a aplicação:**
   ```bash
   docker compose up -d --build
   ```

4. **Acesse a aplicação:**
   Abra seu navegador e navegue para `http://localhost:5175`

### Scripts de Desenvolvimento

- `pnpm run dev` - Iniciar servidor de desenvolvimento
- `pnpm run build` - Gerar build para produção
- `pnpm run preview` - Visualizar build de produção
- `pnpm run typecheck` - Executar verificação de tipos TypeScript
- `pnpm run lint` - Executar linting do código

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── ui/              # Componentes reutilizáveis de UI
│   └── AppLayout.vue    # Layout principal da aplicação
├── views/               # Páginas da aplicação
├── stores/              # Gerenciamento de estado (Pinia)
├── services/            # Camada de serviços da API
├── types/               # Definições TypeScript
├── router/              # Configuração de rotas
└── assets/              # Recursos estáticos
```

## 🔧 Stack Tecnológico

- **Frontend:** Vue.js 3 (Composition API) + TypeScript
- **Build Tool:** Vite
- **Estilização:** Tailwind CSS
- **Estado:** Pinia
- **Roteamento:** Vue Router
- **HTTP Client:** Axios
- **UI Components:** Componentes customizados
- **Ícones:** Lucide Vue Next

## 📝 Configuração

O projeto utiliza um arquivo `.env` para configurações:

```env
VITE_API_BASE_URL=http://localhost:3333
```
