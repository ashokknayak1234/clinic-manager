from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import router as api_router
from app.core.config import get_settings


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Defer database connectivity until schema-dependent routes are enabled.
    yield


app = FastAPI(title="OpenClinic API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
app.include_router(api_router, prefix="/api/v1")


@app.exception_handler(Exception)
async def unexpected_error_handler(_: Request, exc: Exception) -> JSONResponse:
    # Details belong in local server logs; never return exceptions to clients.
    import logging

    logging.getLogger(__name__).exception("Unhandled API error", exc_info=exc)
    return JSONResponse(status_code=500, content={"success": False, "data": None, "error": {"message": "An unexpected server error occurred"}})
