from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi import Request
from .database import engine
from .routers import book, user, borrow
from . import models

app = FastAPI()

models.Base.metadata.create_all(bind=engine)


app.include_router(book.router)
app.include_router(user.router)
app.include_router(borrow.router)
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/")
def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})