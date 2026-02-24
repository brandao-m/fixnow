from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from app.db.db import engine
from app.routers.user import router as user_router
from app.routers.chamado import router as chamado_router

app = FastAPI(
    title='FixNow API',
    description='Plataforma de diagnostico tecnico antecipado',
    version='0.1.0'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#CRIACAO DAS TABELAS
SQLModel.metadata.create_all(engine)

#INCLUSAO DOS ROUTERS
app.include_router(user_router)
app.include_router(chamado_router)

@app.get('/health')
def health_check():
    return {'STATUS': 'OK'}

