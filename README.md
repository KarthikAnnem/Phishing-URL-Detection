# PhishGuard — Federated AI Phishing Detector

Transformer-powered URL threat classification with federated learning.
Classifies URLs as **SAFE**, **PHISHING**, or **ZERO-DAY**.

---

## Project Structure

```
phishing-detector/
├── backend/
│   ├── main.py              ← FastAPI backend (all routes, model inference)
│   ├── requirements.txt
│   ├── Dockerfile
│   └── start.sh
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js / index.css
│   │   ├── context/AuthContext.js
│   │   ├── utils/api.js
│   │   ├── pages/
│   │   │   ├── LandingPage.js / .module.css
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js / AuthPage.module.css
│   │   │   └── Dashboard.js / .module.css
│   │   └── components/
│   │       ├── ScanResult.js / .module.css
│   │       ├── ScanHistory.js / .module.css
│   │       └── StatsPanel.js / .module.css
│   ├── public/index.html
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── transformer_phishing.pt  ← Place your model here
```

---

## Quick Start (Manual)

### 1 — Place the model
Copy `transformer_phishing.pt` into the **`backend/`** folder:
```bash
cp transformer_phishing.pt backend/
```

### 2 — Start the backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be live at **http://localhost:8000**  
Swagger docs at **http://localhost:8000/docs**

### 3 — Start the frontend
```bash
cd frontend
npm install
npm start
```

The app will open at **http://localhost:3000**

---

## Quick Start (Docker)

```bash
cp transformer_phishing.pt .   # must be in project root
docker-compose up --build
```

- Frontend → http://localhost:3000  
- Backend  → http://localhost:8000

---

## API Endpoints

| Method | Route           | Auth | Description               |
|--------|-----------------|------|---------------------------|
| POST   | /auth/register  | No   | Register a new user       |
| POST   | /auth/login     | No   | Login, get JWT token      |
| GET    | /auth/me        | Yes  | Get current user info     |
| POST   | /scan           | Yes  | Scan a URL                |
| GET    | /scan/history   | Yes  | Get scan history          |
| GET    | /stats          | Yes  | Get global threat stats   |
| GET    | /health         | No   | Health check              |

---

## Model Integration

The backend loads `transformer_phishing.pt` via PyTorch at startup.

**If the model loads successfully:**
- URLs are tokenized at character level (max 512 chars, ASCII mod 128)
- The transformer runs inference and returns softmax probabilities
- Classes: `0 = SAFE`, `1 = PHISHING`, `2 = ZERO_DAY`

**If the model is unavailable** (PyTorch not installed or file missing):
- Falls back to the heuristic engine which scores URLs based on:
  - IP address usage, HTTPS presence, URL length, suspicious keywords,
    suspicious TLDs, subdomain depth, @ symbols, redirects,
    encoded characters, and Shannon entropy

---

## Threat Classes

screen shots of the outputs
<img width="1892" height="978" alt="Screenshot 2025-11-12 102157" src="https://github.com/user-attachments/assets/a0e0a1c4-e13c-4dce-a9fb-56babb0463f4" />



| Label    | Meaning                                              |
|----------|------------------------------------------------------|
| SAFE     | URL appears legitimate, no threat indicators         |
| PHISHING | Known phishing patterns detected with high confidence|
| ZERO DAY | Novel threat pattern — treat with extreme caution    |
