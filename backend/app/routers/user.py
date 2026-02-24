from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from app.db.db import get_session
from app.models.user import User, UserRole
from app.schemas.user_schema import UserCreate, UserRead, TokenResponse
from app.core.security import verify_password, hash_password, criar_token, get_current_user, require_role

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

# ===============================
# RETORNO DO USUARIO AUTENTICADO
# ===============================
@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# ======
# LOGIN
# ======
@router.post("/login", response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):

    usuario = session.exec(
        select(User).where(User.email == form_data.username)
    ).first()

    if not usuario:
        raise HTTPException(status_code=400, detail="Email ou senha invalidos")

    if not verify_password(form_data.password, usuario.senha_hash):
        raise HTTPException(status_code=400, detail="Email ou senha invalidos")

    token = criar_token({"sub": str(usuario.id)})

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# ==============
# CRIAR USUARIO
# ==============
@router.post("/", response_model=UserRead)
def criar_usuario(
    user: UserCreate,
    session: Session = Depends(get_session)
):

    usuario_existente = session.exec(
        select(User).where(User.email == user.email)
    ).first()

    if usuario_existente:
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    senha_hash = hash_password(user.senha)

    novo_usuario = User(
        nome=user.nome,
        email=user.email,
        senha_hash=senha_hash,
        role=user.role
    )

    session.add(novo_usuario)
    session.commit()
    session.refresh(novo_usuario)

    return novo_usuario
# ===========================
# RETORNO APENAS DE TECNICOS
# ===========================
@router.get("/tecnicos", response_model=list[UserRead])
def listar_tecnicos(
    session: Session = Depends(get_session),
    current_user: User = Depends(require_role(UserRole.CENTRAL))
):
    tecnicos = session.exec(
        select(User).where(User.role == UserRole.TECNICO)
    ).all()

    return tecnicos