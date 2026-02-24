from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
from enum import Enum

class StatusChamado(str, Enum):
    ABERTO = "ABERTO"
    EM_ANDAMENTO = "EM_ANDAMENTO"
    CONCLUIDO = "CONCLUIDO"

class Chamado(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    titulo: str
    descricao: str
    endereco: str

    cliente_id: int = Field(foreign_key="user.id")
    tecnico_id: Optional[int] = Field(default=None, foreign_key="user.id")

    status: StatusChamado = Field(default=StatusChamado.ABERTO)
    data_criacao: datetime = Field(default_factory=datetime.utcnow)

    '''
    StatusChamado é um ENUM com os status possíveis.
    cliente_id vai ligar o chamado ao usuário que abriu.
    tecnico_id é opcional, até que o técnico seja atribuído.
    data_criacao salva a hora que o chamado foi aberto.
    '''