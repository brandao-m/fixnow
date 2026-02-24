from sqlmodel import SQLModel
from app.models.user import UserRole

class UserCreate(SQLModel):
    nome: str
    email: str
    senha: str
    role: UserRole

class UserRead(SQLModel):
    id: int
    nome: str
    email: str
    role: UserRole

    model_config = {
        'from_attributes': True
    }

class LoginRequest(SQLModel): # LoginRequest pertence ao domínio de usuário
        email: str
        senha: str

class TokenResponse(SQLModel): # TokenResponse é resposta de autenticação de usuário
        access_token: str
        token_type: str

'''
UserCreate → usado para receber dados do cliente
UserRead → usado para retornar dados sem a senha
'''