from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db.db import get_session
from app.core.security import get_current_user, require_role
from app.models.user import User, UserRole
from app.models.chamado import Chamado, StatusChamado
from app.schemas.chamado_schema import ChamadoCreate, ChamadoRead
from app.services.chamado_service import(
    criar_chamado_service,
    atribuir_tecnico_service,
    finalizar_chamado_service
)

router = APIRouter(prefix="/chamados", tags=["Chamados"])

# =========================
# OBTER CHAMADO
# =========================
@router.get("/{chamado_id}")
def obter_chamado(
    chamado_id: int,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    chamado = db.get(Chamado, chamado_id)

    if not chamado:
        raise HTTPException(
            status_code=404,
            detail="Chamado não encontrado"
        )

    # REGRAS DE AUTORIZAÇÃO
    if current_user.role == UserRole.CLIENTE:
        if chamado.cliente_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Acesso negado"
            )

    elif current_user.role == UserRole.TECNICO:
        if chamado.tecnico_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Acesso negado"
            )

    # CENTRAL PODE VER TUDO → NÃO PRECISA VALIDAR

    tecnico = None
    if chamado.tecnico_id:
        tecnico = db.get(User, chamado.tecnico_id)

    return {
        "id": chamado.id,
        "titulo": chamado.titulo,
        "descricao": chamado.descricao,
        "endereco": chamado.endereco,
        "status": chamado.status,
        "tecnico": {
            "id": tecnico.id,
            "nome": tecnico.nome
        } if tecnico else None
    }
                  
# =========================
# LISTAR CHAMADOS
# =========================
@router.get("/", response_model=list[ChamadoRead])
def listar_chamados(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == UserRole.CENTRAL:
        chamados = session.exec(select(Chamado)).all()

    elif current_user.role == UserRole.TECNICO:
        chamados = session.exec(
            select(Chamado).where(Chamado.tecnico_id == current_user.id)
        ).all()

    else:
        chamados = session.exec(
            select(Chamado).where(Chamado.cliente_id == current_user.id)
        ).all()

    return chamados

# =========================
# CRIAR CHAMADO
# =========================
@router.post('/', response_model=ChamadoRead)
def criar_chamado(
    chamado: ChamadoCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_role(UserRole.CLIENTE))
):
    return criar_chamado_service(
        session=session,
        titulo=chamado.titulo,
        descricao=chamado.descricao,
        endereco=chamado.endereco,
        cliente_id=current_user.id
    )


# =========================
# ATRIBUIR TÉCNICO
# =========================
@router.put('/{chamado_id}/atribuir/{tecnico_id}', response_model=ChamadoRead)
def atribuir_tecnico(
    chamado_id: int,
    tecnico_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_role(UserRole.CENTRAL))
):
    return atribuir_tecnico_service(
        session=session,
        chamado_id=chamado_id,
        tecnico_id=tecnico_id
    )


# =========================
# FINALIZAR CHAMADO
# =========================
@router.put('/{chamado_id}/finalizar', response_model=ChamadoRead)
def finalizar_chamado(
    chamado_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_role(UserRole.TECNICO))
):
    return finalizar_chamado_service(
        session=session,
        chamado_id=chamado_id,
        tecnico_id=current_user.id
    )

'''
Recebe requisição
Valida permissão
Chama service
Retorna resposta
'''