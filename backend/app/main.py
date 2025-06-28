import os
import json
from glob import glob
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Any, Dict, List

# relative import of your Pydantic schemas
from .models import SectionEnhanceRequest, Resume

app = FastAPI(
    title="Resume-Editor API",
    description="Upload, enhance, save, and list resumes",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to your front-end URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory cache if you like, though we always read from disk here
tmp_store: Dict[str, Dict[str, Any]] = {}

# Directory to persist JSON resumes
BASE_DIR = os.path.dirname(__file__)
STORAGE_DIR = os.path.join(BASE_DIR, os.pardir, "resumes")
os.makedirs(STORAGE_DIR, exist_ok=True)


@app.get("/", summary="List all saved resumes")
async def list_all_resumes() -> Dict[str, List[Dict[str, Any]]]:
    """
    Reads every .json file in the resumes/ folder and returns their contents
    as a list of dicts under the 'resumes' key.
    """
    pattern = os.path.join(STORAGE_DIR, "*.json")
    files = glob(pattern)
    all_data = []
    for path in files:
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
                all_data.append(data)
        except Exception as e:
            # skip broken files
            continue
    return {"resumes": all_data}


@app.post("/ai-enhance", summary="Mock AI enhancement of a resume section")
async def ai_enhance(req: SectionEnhanceRequest):
    enhanced = f"[Enhanced] {req.content}"
    return {"section": req.section, "enhanced_content": enhanced}


@app.post("/save-resume", summary="Save or overwrite a resume JSON")
async def save_resume(resume: Resume):
    """
    Saves the incoming Resume JSON under the same name as the original file uploaded.
    E.g. if resume.fileName == "MyCV.docx", we'll write "MyCV.json" in resumes/.
    """
    data = resume.dict()

    # Determine filename stem:
    if resume.fileName:
        # strip extension if present
        stem = os.path.splitext(resume.fileName)[0]
    else:
        # fallback to 'name' field
        stem = resume.name

    # sanitize stem (e.g. replace spaces)
    stem = stem.replace(" ", "_")
    filename = f"{stem}.json"
    path = os.path.join(STORAGE_DIR, filename)

    # Write to disk
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not write file: {e}")

    # Optionally cache in-memory
    tmp_store[stem] = data

    return {
        "status": "ok",
        "message": f"Saved resume under '{filename}'",
        "filename": filename,
    }


@app.get("/resumes", summary="List all saved resume filenames")
async def list_resume_names() -> Dict[str, List[str]]:
    """
    Returns just the list of filenames (without .json) for use in a sidebar.
    """
    files = glob(os.path.join(STORAGE_DIR, "*.json"))
    names = [os.path.splitext(os.path.basename(f))[0] for f in files]
    return {"resumes": names}


@app.get("/resume/{key}", summary="Load a single resume by filename")
async def get_resume(key: str) -> Dict[str, Any]:
    """
    Loads one resume JSON by its filename key (without the .json).
    """
    # Check disk
    path = os.path.join(STORAGE_DIR, f"{key}.json")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Resume not found")

    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not read file: {e}")

    # Cache
    tmp_store[key] = data
    return data
