
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import engine, SessionLocal
from . import models

# 1. サーバー起動時に、models.pyの設計図を元にデータサーバー内に実際のテーブルを作成する
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="なまこ栽培キット API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. 各APIでデータベース（セッション）を安全に利用するための仕組み
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 3. 動作確認用のテストAPI（Hello World）
@app.get("/")
def read_root():
    return {"message": "なまこ栽培キットのバックエンドサーバーが正常に起動しています！"}

# 4. テスト用：ユーザーを作成して初期状態を登録するAPI（後で本格的に作り込みます）
@app.post("/test-setup")
def setup_test_user(username: str, db: Session = Depends(get_db)):
    # 既に同じ名前のユーザーがいるかチェック
    db_user = db.query(models.User).filter(models.User.username == username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="そのユーザー名は既に存在します")
    
    # 新しいユーザーの作成
    new_user = models.User(username=username)
    db.add(new_user)
    db.commit()  # データベースに確定（コミット）
    db.refresh(new_user)
    
    # 初期状態（なまこステータス）の作成
    new_status = models.NamakoStatus(user_id=new_user.id)
    db.add(new_status)
    db.commit()
    
    return {
        "message": "テストユーザーを作成しました！",
        "user_id": new_user.id,
        "username": new_user.username
    }
    