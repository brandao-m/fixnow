from sqlmodel import SQLModel, Field
from enum import Enum
from typing import Optional

class UserRole(str, Enum):
    CLIENTE = 'cliente'
    TECNICO = 'tecnico'
    CENTRAL = 'central'

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str
    email: str = Field(index=True, unique=True) # 1 usuario -> 1 email
    senha_hash: str
    role: UserRole = Field(default=UserRole.CLIENTE)
    especialidade: Optional[str] = None


# id: chave primária
# nome, email, senha: informações básicas
# role: define se é Cliente, Técnico ou Central