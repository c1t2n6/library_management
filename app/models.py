from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class Book(Base):
    __tablename__= "books"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable = False)
    author = Column(String(255), nullable = False)
    isbn = Column(String(13), unique=True, nullable=False)
    publish_year = Column(Integer)
    available = Column(Boolean, default=True)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable = False)
    email = Column(String(255), unique=True, nullable = False)
    phone = Column(String(20))

    borrows = relationship("BorrowRecord", back_populates="user")

class BorrowRecord(Base):
    __tablename__ = "borrow_records"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    book_id = Column(Integer, ForeignKey("books.id"))
    borrow_date = Column(Date, nullable = False)
    return_date = Column(Date)
    status = Column(String(20), default="borrowed")

    user = relationship("User", back_populates="borrows") 
    book = relationship("Book")
