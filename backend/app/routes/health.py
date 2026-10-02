import logging

import pymysql
from fastapi import APIRouter, HTTPException

from app.core.database import connect

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict[str, object]:
    return {"success": True, "data": {"status": "ok"}, "error": None}


@router.get("/health/database")
def database_health() -> dict[str, object]:
    """Verify a real MySQL connection without returning connection details."""
    connection = None
    try:
        connection = connect()
        with connection.cursor() as cursor:
            cursor.execute("SELECT VERSION() AS version, DATABASE() AS database_name")
            row = cursor.fetchone()
        return {"success": True, "data": {"status": "connected", **row}, "error": None}
    except pymysql.MySQLError:
        logging.getLogger(__name__).exception("MySQL health check failed")
        raise HTTPException(
            status_code=503,
            detail={"success": False, "data": None, "error": {"message": "MySQL is unavailable or the configured credentials are invalid"}},
        ) from None
    finally:
        if connection is not None:
            connection.close()
