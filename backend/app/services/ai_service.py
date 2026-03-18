import openai  
import os 

openai.api_key = os.getenv('OPENAI_API_KEY')

def analisar_chamado(descricao: str):
    prompt = f"""
    Você é um assistente técnico de manutenção residencial. 

    Analise o problema descrito abaixo e retorne:
    - categoria do profissional (ex: eletricista, encanador)
    - nível de urgência (baixa, média, alta)
    - uma descrição melhorada do problema

    Problema: {descricao}

    Responda em Json no formato:
    {{
        "categoria": "...",
        "urgencia": "...",
        "descricao_melhorada": "..."
    }}
    """

    response = openai.ChatCompletion.create(
        model='gpt-4o-mini',
        messages=[
            {'role': 'system', 'content': 'Você é um especialista em manutenção residencial'},
            {'role': 'user', 'content': prompt}
        ],
        temerature=0.3,
    )

    return response.choices[0].message['content']