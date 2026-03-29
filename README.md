# Hail Mary Distilled

Hail Mary Distilled is a compact, public-safe LLM project for building a sci-fi themed assistant focused on calm reasoning under uncertainty.

It includes:
- an original instruction dataset
- a LoRA adapter
- a merged full model for easier deployment
- Colab notebooks and automation scripts for training, merging, and publishing

## Live Assets

- GitHub: https://github.com/Chandan062311/Hail-Mary
- Dataset: https://huggingface.co/datasets/Stinger2311/hail-mary-inspired-sci-fi-instruct
- LoRA adapter: https://huggingface.co/Stinger2311/hail-mary-inspired-student-lora
- Merged model: https://huggingface.co/Stinger2311/hail-mary-inspired-student-merged
- Demo Space (primary): https://huggingface.co/spaces/Stinger2311/hail-mary-demo-chat
- Demo Space (backup): https://huggingface.co/spaces/Stinger2311/hail-mary-demo-chat-backup

## Quick Start (Inference)

Use the merged model for easiest inference.

```bash
pip install transformers accelerate safetensors torch
```

```python
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

model_id = "Stinger2311/hail-mary-inspired-student-merged"

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    dtype=torch.float16,
    device_map="auto",
)

prompt = (
    "System: You are a calm, science-literate assistant. "
    "Be explicit about uncertainty when evidence is incomplete.\n\n"
    "User: How should a crew handle uncertainty during first contact?\n\n"
    "Assistant:"
)

inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
with torch.no_grad():
    out = model.generate(
        **inputs,
        max_new_tokens=180,
        temperature=0.7,
        top_p=0.9,
        do_sample=True,
    )

reply = out[0][inputs["input_ids"].shape[-1]:]
print(tokenizer.decode(reply, skip_special_tokens=True))
```

## Repository Structure

- `configs/` - project defaults and model/training recommendations
- `data/` - seed, synthetic, merged training files, and eval prompts
- `docs/` - model card, dataset card, and publishing notes
- `notebooks/` - training + merge workflows for Colab
- `scripts/` - validation, merge, and Hugging Face publishing utilities
- `space_demo/` - Gradio Space app template

## Maintainer Commands

Validate dataset:

```bash
python scripts/validate_dataset.py data/seed_dataset.jsonl
```

Merge reviewed datasets:

```bash
python scripts/merge_datasets.py data/seed_dataset.jsonl data/synthetic_batch_v1.jsonl data/train_v1_combined.jsonl
python scripts/validate_dataset.py data/train_v1_combined.jsonl
```

Merge adapter into full model and publish:

```bash
python scripts/merge_lora_model.py \
  --base-model Qwen/Qwen2.5-3B-Instruct \
  --adapter Stinger2311/hail-mary-inspired-student-lora \
  --output-dir outputs/hail_mary_merged_model \
  --push-repo-id Stinger2311/hail-mary-inspired-student-merged
```

## Notebooks

- `notebooks/train_unsloth_colab.ipynb` - fine-tuning workflow
- `notebooks/merge_model_colab.ipynb` - merge and upload merged model

## Troubleshooting

### Colab warning: `HF_TOKEN` not found

Public model downloads still work. For higher rate limits:

```python
from huggingface_hub import notebook_login
notebook_login()
```

### Space build fails with `audioop` / `pyaudioop`

Ensure:
- `space_demo/README.md` includes `python_version: "3.10"`
- `space_demo/requirements.txt` includes:
  - `gradio==4.44.1`
  - `pyaudioop`

Then redeploy and run `Factory reboot`.

### Space stuck in `BUILDING`

On free `cpu-basic`, queue delays are common. Try:
- wait 10-30 minutes
- `Factory reboot`
- use the backup Space

## Responsible Use

- This project is educational and portfolio-oriented.
- It is inspired by themes, not licensed source text.
- Do not use outputs as authority in high-stakes contexts.

## Related Docs

- `docs/model_card.md`
- `docs/dataset_card.md`
- `docs/quick_publish_steps.md`
- `docs/huggingface_cleanup_and_dataset.md`
