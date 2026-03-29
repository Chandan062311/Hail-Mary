---
title: Hail Mary Demo Chat
emoji: "🚀"
colorFrom: blue
colorTo: indigo
sdk: gradio
sdk_version: 4.44.1
python_version: "3.10"
app_file: app.py
pinned: false
---

# Hail Mary Demo Chat

This Space is a lightweight chat frontend that calls a Hugging Face model endpoint.

## Required Space secrets

Add these in Space Settings -> Variables and secrets:

- `HF_TOKEN`: Hugging Face token with read access to your model/endpoint
- `HF_MODEL_ID`: model id to call (default in app: `Stinger2311/hail-mary-inspired-student-merged`)

Optional variables:

- `SYSTEM_PROMPT`
- `MAX_NEW_TOKENS`
- `TEMPERATURE`
- `TOP_P`

## Local test

```bash
pip install -r requirements.txt
python app.py
```
