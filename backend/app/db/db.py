from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "postgresql://postgres:pgmt@localhost:5432/fixnow_db"

engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session