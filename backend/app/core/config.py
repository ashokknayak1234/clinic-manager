from functools import lru_cache
from pathlib import Path

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    db_host: str = "localhost"
    db_port: int = Field(default=3306, ge=1, le=65535)
    db_name: str = "openclinic_db"
    db_user: str = "openclinic_app"
    db_password: SecretStr = SecretStr("change_me")
    jwt_secret: SecretStr = SecretStr("replace_with_a_long_random_secret")
    jwt_expire_minutes: int = Field(default=60, gt=0)
    cors_origins: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
