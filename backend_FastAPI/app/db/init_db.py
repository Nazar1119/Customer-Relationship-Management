# app/db/init_db.py
import pymysql
from urllib.parse import urlparse
from app.core.config import settings
from app.db.session import engine
from app.db.base import Base

def create_database_if_not_exists():
    dsn = urlparse(settings.aws_db)
    user = dsn.username
    password = dsn.password
    host = dsn.hostname
    port = dsn.port or 3306
    db_name = dsn.path.lstrip('/')

    connection = pymysql.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        database='mysql',
        cursorclass=pymysql.cursors.Cursor
    )
    with connection.cursor() as cursor:
        cursor.execute(
            f"CREATE DATABASE IF NOT EXISTS `{db_name}` "
            "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        )
    connection.commit()
    connection.close()

def init_db():
    create_database_if_not_exists()
    Base.metadata.create_all(bind=engine)
