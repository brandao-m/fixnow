# FixNow

Plataforma fullstack para gestão de chamados técnicos com autenticação JWT e controle de acesso por perfil.

## Visão Geral

FixNow é um sistema de gerenciamento de chamados técnicos desenvolvido com arquitetura moderna e foco em segurança, separação de responsabilidades e escalabilidade futura.

O sistema permite:

- Clientes abrirem chamados
- Central administrativa atribuir técnicos
- Técnicos finalizarem atendimentos
- Controle de acesso por perfil (CLIENTE, TECNICO, CENTRAL)
- Autenticação via JWT

---

## Arquitetura

O projeto está dividido em:

```
fixnow/
│
├── backend/     # API REST (FastAPI + SQLModel + PostgreSQL)
├── frontend/    # Interface (React + Vite)
└── README.md
```

### Backend

- FastAPI
- SQLModel
- PostgreSQL
- JWT Authentication
- OAuth2 Password Flow
- Arquitetura em camadas:
  - routers
  - services
  - models
  - schemas
  - core

### Frontend

- React
- Vite
- Consumo de API via token JWT
- Renderização dinâmica baseada no perfil do usuário

---

## 🔐 Controle de Acesso

O sistema possui três níveis de acesso:

- CLIENTE → Pode abrir e visualizar seus próprios chamados
- TECNICO → Visualiza apenas chamados atribuídos a ele
- CENTRAL → Pode visualizar todos os chamados e atribuir técnicos

---

## Fluxo Operacional

1. Cliente cria chamado (status: ABERTO)
2. Central atribui técnico (status: EM_ANDAMENTO)
3. Técnico finaliza chamado (status: CONCLUIDO)

Transições de status são controladas no service layer.

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

## Objetivo do Projeto

Este projeto foi desenvolvido como:

- Demonstração de arquitetura backend profissional
- Exercício de controle de autenticação e autorização
- Base para evolução futura para modelo SaaS

---

## Roadmap Futuro

- Multiempresa (multi-tenant)
- Deploy em produção
- Recuperação de senha
- Logs de auditoria
- Interface aprimorada
- Modelo SaaS

---

## Autor
Marcus Brandão  
Backend Developer (Python / APIs REST)
