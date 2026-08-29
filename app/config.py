from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MONA AI Backend"
    GOOGLE_API_KEY: str  # Declaring it here ensures it's required and loaded properly

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()