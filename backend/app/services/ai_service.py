from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def analisar_chamado(descricao: str):
    prompt = f"""
    Você é um assistente técnico de manutenção residencial.

    Analise o problema abaixo e retorne:
    - categoria do profissional
    - urgência (baixa, média, alta)
    - descrição melhorada

    Problema: {descricao}

    Responda em JSON:
    {{
        "categoria": "...",
        "urgencia": "...",
        "descricao_melhorada": "..."
    }}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Você é especialista em manutenção."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.3,
    )

    return response.choices[0].message.content