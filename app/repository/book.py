from sqlalchemy.orm import Session
from .. import models, schemas
from fastapi import HTTPException, status

def get_all(db: Session):
    books = db.query(models.Book).all()
    return books

def show(id: int, db: Session):
    book = db.query(models.Book).filter(models.Book.id == id).first()
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{id} book is not exist")
    return book

def create(request: schemas.BookCreate, db: Session):
    newBook = models.Book(title = request.title, author = request.author, isbn = request.isbn, publish_year = request.publish_year, available = request.available)
    db.add(newBook)
    db.commit()
    db.refresh(newBook)
    return newBook


