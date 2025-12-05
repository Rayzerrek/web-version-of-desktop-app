# Learning Platform Backend

FastAPI backend z walidacją kodu (Python, JavaScript, TypeScript).

## 🚀 Quick Start

### Lokalnie (development)

```bash
# Zainstaluj zależności
pip install -r requirements.txt

# Uruchom serwer
python main.py
```

### Docker (recommended)

```bash
# Z głównego folderu projektu
docker-compose up -d

# Logi
docker-compose logs -f backend

# Zatrzymaj
docker-compose down
```

## 🌐 Deployment Options

### 1. Railway (Rekomendowane - najłatwiejsze)
- Automatyczny deploy z GitHub
- Darmowy tier (500h/miesiąc)
- Wspiera Docker

```bash
# Zainstaluj Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

### 2. Render
- Darmowy tier dostępny
- Auto-deploy z GitHub
- Dodaj jako "Web Service" → Docker

### 3. Fly.io
```bash
# Zainstaluj flyctl
# https://fly.io/docs/hands-on/install-flyctl/

fly auth login
fly launch
fly deploy
```

### 4. DigitalOcean App Platform
- $5/miesiąc (basic)
- Dobra wydajność
- Łatwa konfiguracja

### 5. VPS (pełna kontrola)
- DigitalOcean Droplet / Hetzner / OVH
- Docker + docker-compose
- Nginx jako reverse proxy

## 📁 Struktura

```
backend/
├── main.py           # FastAPI app
├── config.py         # Settings
├── Dockerfile        # Docker config
├── models/           # Pydantic models
├── routers/          # API endpoints
├── services/         # Business logic (code executor)
└── utils/            # Helpers
```

## 🔧 Environment Variables

```env
ENVIRONMENT=production
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your-key
CORS_ORIGINS=https://your-frontend.vercel.app
```

## 📚 API Docs

- Swagger UI: `/docs`
- ReDoc: `/redoc`
- Health check: `/health`