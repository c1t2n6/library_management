from fastapi import APIRouter, Depends, status, HTTPException
from .. import schemas, database, models
from typing import List
from sqlalchemy.orm import Session
from ..repository import book

router = APIRouter (
    prefix="/book",
    tags=["Books"]
)

get_db = database.get_db

@router.get('/', response_model=List[schemas.Book])
def get_all(db: Session = Depends(get_db)):
    return book.get_all(db)

@router.get('/{id}', response_model=schemas.Book)
def show(id: int, db : Session = Depends(get_db)):
    return book.show(id, db)

@router.post('/')
def create(request: schemas.BookCreate, db: Session = Depends(get_db)):
    return book.create(request, db)
