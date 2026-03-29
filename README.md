# Hail Mary Distilled

Small, portfolio-safe sci-fi assistant project inspired by Project Hail Mary themes (science, uncertainty, teamwork, first contact), trained with Unsloth + LoRA and published on Hugging Face.

## Live links

- GitHub repo: https://github.com/Chandan062311/Hail-Mary
- LoRA adapter model: https://huggingface.co/Stinger2311/hail-mary-inspired-student-lora
- Merged full model: https://huggingface.co/Stinger2311/hail-mary-inspired-student-merged
- Dataset: https://huggingface.co/datasets/Stinger2311/hail-mary-inspired-sci-fi-instruct
- Primary demo Space: https://huggingface.co/spaces/Stinger2311/hail-mary-demo-chat
- Backup demo Space: https://huggingface.co/spaces/Stinger2311/hail-mary-demo-chat-backup

## What this repo contains

- Original seed + synthetic instruction data
- Validation, merge, and publishing scripts
- Unsloth training notebook
- Colab notebook for LoRA-to-full-model merge
- Ready-to-upload Hugging Face Space demo app

Main folders:
- data
- scripts
- notebooks
- docs
- space_demo

## Quickstart for users

Use the merged full model for easiest inference.

Install:

```bash
pip install transformers accelerate safetensors torch
```

Run:

```python
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

model_id = "Stinger2311/hail-mary-inspired-student-merged"

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    torch_dtype=torch.float16,
    device_map="auto",
)

prompt = (
    "System: You are a calm, science-literate assistant. "
    "Be honest about uncertainty.\n\n"
    "User: How should a crew handle uncertainty during first contact?\n\n"
    "Assistant:"
)

inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
with torch.no_grad():
    out = model.generate(**inputs, max_new_tokens=180, temperature=0.7, do_sample=True)

reply = out[0][inputs["input_ids"].shape[-1]:]
print(tokenizer.decode(reply, skip_special_tokens=True))
```

## Quickstart for maintainers

Validate data:

```bash
python scripts/validate_dataset.py data/seed_dataset.jsonl
```

Merge training data:

```bash
python scripts/merge_datasets.py data/seed_dataset.jsonl data/synthetic_batch_v1.jsonl data/train_v1_combined.jsonl
python scripts/validate_dataset.py data/train_v1_combined.jsonl
```

Merge adapter into full model:

```bash
python scripts/merge_lora_model.py \
  --base-model Qwen/Qwen2.5-3B-Instruct \
  --adapter Stinger2311/hail-mary-inspired-student-lora \
  --output-dir outputs/hail_mary_merged_model \
  --push-repo-id Stinger2311/hail-mary-inspired-student-merged
```

## Notebooks

- notebooks/train_unsloth_colab.ipynb: training workflow
- notebooks/merge_model_colab.ipynb: merge + upload merged model

## Demo deployment notes

The Space app lives in space_demo.

If Space build queue is slow on free cpu-basic, the app can remain in BUILDING for a while. In that case:
- wait and refresh
- use Factory reboot
- or use the backup Space link above

## Safety and licensing notes

- Dataset text is original and intended to be public-safe.
- Do not include copyrighted passages or direct quotes.
- Revoke any token immediately if it is ever exposed.

## Additional docs

- docs/quick_publish_steps.md
- docs/huggingface_cleanup_and_dataset.md
- docs/model_card.md
- docs/dataset_card.md
