from openai import OpenAI
import os

def analisar_chamado(descricao: str):
    try:
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Você é especialista em manutenção."},
                {"role": "user", "content": descricao},
            ],
            temperature=0.3,
        )

        return response.choices[0].message.content

    except Exception as e:
        print("Erro IA:", e)

        # fallback (simulação)
        return {
            "categoria": "encanador",
            "urgencia": "média",
            "descricao_melhorada": descricao
        }