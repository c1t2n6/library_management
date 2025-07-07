from sqlalchemy.orm import Session
from .. import models, schemas
from fastapi import HTTPException, status
from . import book
def borrow_book(request: schemas.BorrowCreate, db: Session):
    cur_book = book.show(request.book_id, db)

    borrow = models.BorrowRecord(
        user_id = request.user_id,
        book_id = request.book_id,
        borrow_date = request.borrow_date,
    )


    cur_book.available = False
    db.add(borrow)
    db.commit()
    db.refresh(borrow)
    return borrow
def show(id: int, db: Session):
    borrow = db.query(models.BorrowRecord).filter(models.BorrowRecord.id == id).first()
    if not borrow:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{id}th borrow record is not exist")
    return borrow

def return_book(request: schemas.BorrowReturn, db: Session):
    borrow = show(request.id, db)
    cur_book = book.show(borrow.book_id, db)
    borrow.return_date = request.return_date
    borrow.status = "returned"
    cur_book.available = True
    db.commit()
    db.refresh(borrow)

    return borrow