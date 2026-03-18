def analisar_chamado(descricao: str):
    descricao_lower = descricao.lower()

    # 🔧 CATEGORIA
    if any(p in descricao_lower for p in ["torneira", "vazamento", "cano", "água"]):
        categoria = "encanador"

    elif any(p in descricao_lower for p in ["luz", "tomada", "fio", "energia", "curto", "disjuntor"]):
        categoria = "eletricista"

    elif any(p in descricao_lower for p in ["ar condicionado", "geladeira", "freezer"]):
        categoria = "refrigeração"

    elif any(p in descricao_lower for p in ["porta", "portão", "fechadura"]):
        categoria = "serralheiro"

    else:
        categoria = "técnico geral"

    # ⚡ URGÊNCIA
    if any(p in descricao_lower for p in ["urgente", "perigo", "vazando muito", "fogo"]):
        urgencia = "alta"

    elif any(p in descricao_lower for p in ["não funciona", "quebrou", "parou"]):
        urgencia = "média"

    else:
        urgencia = "baixa"

    # 📝 DESCRIÇÃO MELHORADA
    descricao_melhorada = descricao.capitalize()

    return {
        "categoria": categoria,
        "urgencia": urgencia,
        "descricao_melhorada": descricao_melhorada
    }