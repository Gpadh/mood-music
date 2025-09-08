# Mood Music AI

AI-powered song recommendations based on your mood (text or image).

## How to Run Locally

### Backend
1. `cd backend`
2. `python -m venv venv`
3. `venv\Scripts\activate` (Windows)
4. `pip install -r requirements.txt`
5. Set your Spotify API credentials in `.env`
6. `uvicorn main:app --reload`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm start`

## Deployment

- Backend: Deploy with [Render](https://render.com/), [Railway](https://railway.app/), or [Azure App Service](https://azure.microsoft.com/en-us/products/app-service/).
- Frontend: Deploy with [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/), or [Azure Static Web Apps](https://azure.microsoft.com/en-us/products/app-service/static/).

**Set environment variables for Spotify credentials on your backend host!**
