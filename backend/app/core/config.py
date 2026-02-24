from datetime import timedelta

SECRET_KEY = 'uma-chave-bem-grande-e-aleatoria'
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def get_token_expire_time():
    return timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)