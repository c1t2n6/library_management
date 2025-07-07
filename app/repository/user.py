from sqlalchemy.orm import Session
from .. import schemas, models
from fastapi import HTTPException, status

def create(request: schemas.UserCreate, db: Session):
    new_user = models.User(full_name = request.full_name, email = request.email, phone = request.phone)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_all(db:Session):
    users = db.query(models.User).all()
    return users