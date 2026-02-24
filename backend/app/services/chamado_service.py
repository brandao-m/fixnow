from sqlmodel import Session, select
from fastapi import HTTPException
from app.models.chamado import Chamado, StatusChamado
from app.models.user import User, UserRole

def criar_chamado_service(
        session: Session,
        titulo: str,
        descricao: str,
        endereco: str,
        cliente_id: int
):
        novo_chamado = Chamado(
                titulo=titulo,
                descricao=descricao,
                endereco=endereco,
                cliente_id=cliente_id
        )

        session.add(novo_chamado)
        session.commit()
        session.refresh(novo_chamado)

        return novo_chamado

def atribuir_tecnico_service(
                session: Session,
                chamado_id: int,
                tecnico_id: int
):
        chamado = session.get(Chamado, chamado_id)

        if not chamado:
                raise HTTPException(status_code=404, detail='Chamado nao encontrado')
        
        tecnico = session.get(User, tecnico_id)

        if not tecnico or tecnico.role != UserRole.TECNICO:
                raise HTTPException(status_code=404, detail='Usuario nao e um tecnico valido')
        
        if chamado.status != StatusChamado.ABERTO:
                raise HTTPException(
                        status_code=400,
                        detail='Somente chamados ABERTOS podem ser atribuidos'
                )
        
        chamado.tecnico_id = tecnico_id
        chamado.status = StatusChamado.EM_ANDAMENTO

        session.commit()
        session.refresh(chamado)

        return chamado


def finalizar_chamado_service(
                session: Session,
                chamado_id: int,
                tecnico_id: int
):
        chamado = session.get(Chamado, chamado_id)

        if not chamado:
                raise HTTPException(status_code=404, detail='Chamado nao encontrado')
        
        if chamado.tecnico_id != tecnico_id:
                raise HTTPException(
                        status_code=403,
                        detail='Voce nao pode finalizar este chamado'
                )
        
        if chamado.status != StatusChamado.EM_ANDAMENTO:
                raise HTTPException(
                        status_code=400,
                        detail='Chamado nao esta em andamento'
                )
        
        chamado.status = StatusChamado.CONCLUIDO

        session.commit()
        session.refresh(chamado)

        return chamado

'''

Executa regra de negócio
Acessa banco
Valida transições
Centraliza lógica

'''
