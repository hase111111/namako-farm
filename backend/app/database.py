
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Dockerで立ち上げたPostgreSQL（データサーバー）の住所（URL）
# 構造: postgresql://[ユーザー名]:[パスワード]@[ホスト名]:[ポート番号]/[データベース名]
SQLALCHEMY_DATABASE_URL = "postgresql://namako_user:password@localhost:5432/namako_db"

# 2. データベースと通信を行うためのエンジン（心臓部）を作成
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 3. データベースを操作するための「セッション（窓口）」を作るクラス
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. 今後作成するテーブル（モデル）のベースとなるクラス
Base = declarative_base()
