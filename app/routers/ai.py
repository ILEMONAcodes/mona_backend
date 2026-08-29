from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
from google import genai
from google.genai import errors, types
from app.config import settings

router = APIRouter(prefix="/ai", tags=["AI Processing"])

@router.post("/process")
async def process_screen_ai(
    prompt: str = Form(...),
    file: Optional[UploadFile] = File(None)
):
    try:
        client = genai.Client(api_key=settings.GOOGLE_API_KEY)
        
        # Build contents dynamically based on whether a screenshot/image is provided
        contents = [prompt]
        
        if file:
            file_bytes = await file.read()
            image_part = types.Part.from_bytes(
                data=file_bytes,
                mime_type=file.content_type or "image/jpeg"
            )
            contents.append(image_part)
        
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=contents,
        )
        
        return {
            "status": "success",
            "result": response.text
        }
    except errors.APIError as e:
        raise HTTPException(status_code=500, detail=f"Gemini API Error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))