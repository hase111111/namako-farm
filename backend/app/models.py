from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

# 1. ユーザーテーブル
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # リレーション（他のテーブルとの繋がり）の設定
    # ユーザーが消えたら、その人のなまこ状態や図鑑も一緒に消える（cascade）ようにします
    status = relationship("NamakoStatus", back_populates="user", uselist=False, cascade="all, delete-orphan")
    zukan_records = relationship("Zukan", back_populates="user", cascade="all, delete-orphan")


# 2. なまこの栽培状態テーブル
class NamakoStatus(Base):
    __tablename__ = "namako_status"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # GaaSで最も重要な「時間」の記録
    last_fed_at = Column(DateTime, nullable=True)  # 最後にエサをやった時間（Nullならまだ一度もやってない）
    current_growth = Column(Integer, default=0)    # 現在の成長度（例: 0〜100）

    # ユーザーテーブルとの紐付け
    user = relationship("User", back_populates="status")


# 3. ナマコ図鑑テーブル（誰が、どのなまこを発見したか）
class Zukan(Base):
    __tablename__ = "zukan"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    namako_type_id = Column(String, nullable=False)  # なまこの種類（"normal", "golden" など）
    discovered_at = Column(DateTime, default=datetime.utcnow)

    # ユーザーテーブルとの紐付け
    user = relationship("User", back_populates="zukan_records")
    