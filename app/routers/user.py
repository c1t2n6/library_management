from fastapi import APIRouter, Depends, status, HTTPException
from .. import schemas, database, models
from typing import List
from sqlalchemy.orm import Session
from ..repository import book, user

router = APIRouter (
    prefix="/user",
    tags=["Users"]
)

get_db = database.get_db

@router.post('/')
def create(request : schemas.UserCreate, db : Session = Depends(get_db)):
    return user.create(request, db)


@router.get('/')
def get_all(db: Session = Depends(get_db)):
    return user.get_all(db)