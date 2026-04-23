#!/bin/bash
# ─────────────────────────────────────────────
#  PhishGuard Backend — startup script
# ─────────────────────────────────────────────
echo "🛡️  Starting PhishGuard Backend..."

# Copy model file to backend directory if it exists alongside
if [ -f "../transformer_phishing.pt" ]; then
    cp ../transformer_phishing.pt ./transformer_phishing.pt
    echo "✅ Model file copied"
elif [ -f "../../transformer_phishing.pt" ]; then
    cp ../../transformer_phishing.pt ./transformer_phishing.pt
    echo "✅ Model file copied"
fi

pip install -r requirements.txt -q

uvicorn main:app --host 0.0.0.0 --port 8000 --reload
