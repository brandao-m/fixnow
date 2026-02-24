from pydantic import BaseModel
from datetime import datetime
from app.models.chamado import StatusChamado

class ChamadoCreate(BaseModel):
    titulo: str
    descricao: str
    endereco: str

class ChamadoRead(BaseModel):
    id: int
    titulo: str
    descricao: str
    endereco: str
    cliente_id: int
    tecnico_id: int | None
    status: StatusChamado
    data_criacao: datetime

    model_config = {
        'from_attributes': True
    }
        
'''
ChamadoCreate será usado para criar um chamado via POST.
ChamadoRead será usado para retorno via GET.
'''
