import os

import gradio as gr
from huggingface_hub import InferenceClient

MODEL_ID = os.getenv("HF_MODEL_ID", "Stinger2311/hail-mary-inspired-student-merged")
API_TOKEN = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACEHUB_API_TOKEN")
SYSTEM_PROMPT = os.getenv(
    "SYSTEM_PROMPT",
    "You are a calm, science-literate assistant. Be clear about uncertainty and avoid overconfident claims.",
)
MAX_NEW_TOKENS = int(os.getenv("MAX_NEW_TOKENS", "220"))
TEMPERATURE = float(os.getenv("TEMPERATURE", "0.7"))
TOP_P = float(os.getenv("TOP_P", "0.9"))

client = InferenceClient(model=MODEL_ID, token=API_TOKEN)


def generate_reply(user_prompt: str) -> str:
    if not user_prompt or not user_prompt.strip():
        return "Please enter a prompt."

    prompt = (
        f"System: {SYSTEM_PROMPT}\n\n"
        f"User: {user_prompt.strip()}\n\n"
        "Assistant:"
    )

    try:
        output = client.text_generation(
            prompt,
            max_new_tokens=MAX_NEW_TOKENS,
            temperature=TEMPERATURE,
            top_p=TOP_P,
            return_full_text=False,
        )
        return output.strip() if output else "No response returned."
    except Exception as exc:
        return (
            "Inference failed. If you are using an adapter-only repo, deploy a merged model or endpoint first.\n\n"
            f"Error details: {exc}"
        )


demo = gr.Interface(
    fn=generate_reply,
    inputs=gr.Textbox(lines=6, label="Your prompt", placeholder="Ask a sci-fi reasoning question..."),
    outputs=gr.Textbox(lines=12, label="Model response"),
    title="Hail Mary Demo (Simple)",
    description="Minimal prompt-response demo for fast validation.",
    flagging_mode="never",
)


if __name__ == "__main__":
    demo.launch()
