from pydantic import BaseModel
from datetime import date
from typing import Optional
class BookBase(BaseModel):
    title: str
    author: str
    isbn: str
    publish_year: int
    available: bool

class BookCreate(BookBase):
    pass 

class Book(BookBase):
    id: int
    class Config:
        from_attributes=True

class UserBase(BaseModel):
    full_name: str
    email: str
    phone: str

class UserCreate(UserBase):
    pass 

class User(UserBase):
    id: int
    class Config:
        from_attributes=True

class BorrowBase(BaseModel):
    user_id: int
    book_id: int
    borrow_date: date
    return_date: Optional[date] = None
    status: str = "borrowed"

class BorrowCreate(BaseModel):
    user_id: int
    book_id: int
    borrow_date: date

class BorrowReturn(BaseModel):
    id: int
    return_date: date

class Borrow(BorrowBase):
    id: int

    class Config:
        from_attributes=True


