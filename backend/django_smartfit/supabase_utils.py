import os
from uuid import uuid4
from supabase import create_client, Client

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
BUCKET_NAME = os.environ.get("SUPABASE_BUCKET_NAME", "images")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError("Supabase credentials are missing")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

def upload_to_supabase(file, folder="exercises") -> str:
    ext = file.name.rsplit(".", 1)[-1].lower()
    unique_name = f"{uuid4()}.{ext}"
    path = f"{folder}/{unique_name}"

    file_data = file.read()
    supabase.storage.from_(BUCKET_NAME).upload(path, file_data)

    result = supabase.storage.from_(BUCKET_NAME).get_public_url(path)

    if isinstance(result, dict):
        return result.get('public_url', '')
    return result  
