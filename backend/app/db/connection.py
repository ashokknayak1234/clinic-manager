from collections.abc import Iterator
from contextlib import contextmanager

import pymysql
from pymysql.connections import Connection

from app.core.config import get_settings


def connect() -> Connection:
    """Open a short-lived connection to the configured local MySQL server."""
    settings = get_settings()
    return pymysql.connect(
        host=settings.db_host,
        port=settings.db_port,
        user=settings.db_user,
        password=settings.db_password.get_secret_value(),
        database=settings.db_name,
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=False,
        connect_timeout=5,
    )


@contextmanager
def transaction() -> Iterator[Connection]:
    """Commit all work on success and roll it back on any exception."""
    connection = connect()
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()
