# FixNow

Plataforma fullstack para gestão de chamados técnicos, com autenticação JWT e controle de acesso por perfil.

---

## Visão Geral

O FixNow é um sistema de gerenciamento de chamados técnicos desenvolvido com foco em:

- Arquitetura organizada
- Separação clara de responsabilidades
- Segurança com autenticação JWT
- Controle de acesso por perfil
- Base sólida para evolução futura como SaaS

O sistema permite:

- Clientes abrirem chamados
- Central administrativa atribuir técnicos
- Técnicos finalizarem atendimentos
- Controle de acesso por perfil (CLIENTE, TECNICO, CENTRAL)

---

## Arquitetura

O projeto está dividido em duas camadas principais:
```
fixnow/
│
├── backend/ # API REST (FastAPI + SQLModel + PostgreSQL)
├── frontend/ # Interface (React + TypeScript + Vite)
└── README.md
```

## Backend

Tecnologias utilizadas:

- FastAPI  
- SQLModel  
- PostgreSQL  
- JWT Authentication  
- OAuth2 Password Flow  

Organização em camadas:

- `routers` → definição dos endpoints
- `services` → regras de negócio
- `models` → entidades do banco
- `schemas` → validação e serialização
- `core` → segurança e configurações

As transições de status e regras críticas são controladas na camada de service.

---

## Frontend

Tecnologias utilizadas:

- React + TypeScript  
- Vite  
- TailwindCSS  
- Axios  

O frontend consome a API via token JWT e renderiza a interface dinamicamente conforme o perfil do usuário autenticado.

---

## Controle de Acesso

O sistema possui três níveis de acesso:

**CLIENTE**  
→ Pode abrir e visualizar apenas seus próprios chamados  

**TECNICO**  
→ Visualiza apenas chamados atribuídos a ele  
→ Pode finalizar atendimentos  

**CENTRAL**  
→ Pode visualizar todos os chamados  
→ Pode atribuir técnicos  

---

## Fluxo Operacional

1. Cliente cria chamado → `ABERTO`
2. Central atribui técnico → `EM_ANDAMENTO`
3. Técnico finaliza atendimento → `CONCLUIDO`

---

## Como rodar o projeto

### Backend
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```
cd frontend
npm install
npm run dev
```
---

### Objetivo do Projeto

Este projeto foi desenvolvido como:
- Demonstração de arquitetura backend profissional
- Exercício prático de autenticação e autorização
- Base estruturada para futura evolução como SaaS

### Autor

Marcus Brandão
Backend Developer (Python / APIs REST)
