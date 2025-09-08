import os
import io
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from spotipy import Spotify
from spotipy.oauth2 import SpotifyClientCredentials
from dotenv import load_dotenv
from transformers import pipeline
from deepface import DeepFace
from PIL import Image

load_dotenv()

SPOTIPY_CLIENT_ID = os.getenv("SPOTIPY_CLIENT_ID")
SPOTIPY_CLIENT_SECRET = os.getenv("SPOTIPY_CLIENT_SECRET")

sp = Spotify(auth_manager=SpotifyClientCredentials(
    client_id=SPOTIPY_CLIENT_ID,
    client_secret=SPOTIPY_CLIENT_SECRET
))
app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

emotion_classifier = pipeline("text-classification", model="bhadresh-savani/distilbert-base-uncased-emotion")

class MoodRequest(BaseModel):
    mood: str

class SongRecommendation(BaseModel):
    title: str
    artist: str
    url: str

EMOTION_TO_SPOTIFY = {
    "angry": "rock",        
    "anger": "rock",        
    "disgust": "dark",
    "fear": "ambient",
    "happy": "happy",
    "sad": "sad",
    "surprise": "surprise",
    "neutral": "chill",
    "calm": "chill",
    "joy": "happy",
    "love": "love"
}

@app.post("/recommend", response_model=List[SongRecommendation])
async def recommend_songs(request: MoodRequest):
    emotion_result = emotion_classifier(request.mood)
    emotion = emotion_result[0]['label'].lower()
    search_term = EMOTION_TO_SPOTIFY.get(emotion, "chill")

    results = sp.search(q=search_term, type='track', limit=20)
    recommendations = []
    for item in results['tracks']['items']:
        recommendations.append(SongRecommendation(
            title=item['name'],
            artist=item['artists'][0]['name'],
            url=item['external_urls']['spotify']
        ))
    return recommendations

@app.post("/recommend_from_image", response_model=List[SongRecommendation])
async def recommend_songs_from_image(file: UploadFile = File(...)):

    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image.save("temp.jpg")  

    
    try:
        analysis = DeepFace.analyze(img_path="temp.jpg", actions=['emotion'], enforce_detection=False)
        emotion = analysis[0]['dominant_emotion'].lower()
    except Exception as e:
        print("DeepFace error:", e)
        return JSONResponse(status_code=400, content={"error": str(e)})

    
    search_term = EMOTION_TO_SPOTIFY.get(emotion, "chill")

    print(f"Detected emotion: {emotion}, Spotify search term: {search_term}")

    results = sp.search(q=search_term, type='track', limit=20)
    recommendations = []
    for item in results['tracks']['items']:
        recommendations.append(SongRecommendation(
            title=item['name'],
            artist=item['artists'][0]['name'],
            url=item['external_urls']['spotify']
        ))
    return recommendations