from fastapi import APIRouter, Depends, status, HTTPException
from .. import schemas, database, models
from typing import List
from sqlalchemy.orm import Session
from ..repository import borrow

router = APIRouter(
    prefix = "/borrow",
    tags = ["Borrows"]
)
get_db = database.get_db
@router.post("/",response_model=schemas.Borrow)
def borrow_book(request : schemas.BorrowCreate, db: Session = Depends(get_db)):
    return borrow.borrow_book(request, db)

@router.put("/return", response_model=schemas.Borrow)
def return_book(request: schemas.BorrowReturn, db: Session = Depends(get_db)):
    return borrow.return_book(request, db)