from fastapi import FastAPI
from .database import engine
from .routers import book, user, borrow
from . import models

app = FastAPI()

models.Base.metadata.create_all(bind=engine)


app.include_router(book.router)
app.include_router(user.router)
app.include_router(borrow.router)