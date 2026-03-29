# Hail Mary Distilled

Build a small, public-safe, `Project Hail Mary`-inspired assistant using Unsloth, Google Colab, and Hugging Face.

This repo is designed for learning:
- create an original dataset inspired by the story's themes
- distill a small student model using teacher-generated synthetic data
- fine-tune with Unsloth on free Colab
- evaluate the result on a fixed benchmark set
- deploy the model and dataset to Hugging Face

## What this project is

This project is:
- inspired by themes like science, first contact, teamwork, uncertainty, and survival
- safe for public release because the dataset examples are original
- optimized for low compute and a beginner-friendly workflow

This project is not:
- a reproduction of copyrighted book or movie text
- a claim of official affiliation with the franchise
- a state-of-the-art training run

## Repo structure

- `data/seed_dataset.jsonl` — hand-written training examples
- `data/synthetic_batch_v1.jsonl` — first expanded batch of original examples
- `data/eval_prompts.jsonl` — fixed benchmark prompts
- `data/train_v1_combined.placeholder` — target filename for the merged training set
- `configs/project_config.yaml` — recommended models and training defaults
- `scripts/validate_dataset.py` — schema and safety checks for the dataset
- `scripts/preview_eval.py` — simple local evaluation prompt preview
- `scripts/merge_datasets.py` — combines seed and reviewed synthetic batches
- `scripts/prepare_model_repo.py` — strips checkpoint clutter from a model export folder
- `scripts/merge_lora_model.py` — merges LoRA adapter into a full deployable model
- `scripts/publish_hf_model.py` — uploads a clean model folder to Hugging Face
- `scripts/publish_hf_dataset.py` — creates and uploads a Hugging Face dataset repo
- `scripts/score_eval_template.py` — prints a manual scoring worksheet
- `notebooks/train_unsloth_colab.ipynb` — main Colab notebook
- `docs/dataset_card.md` — Hugging Face dataset card draft
- `docs/huggingface_cleanup_and_dataset.md` — cleanup and dataset publishing guide
- `docs/quick_publish_steps.md` — shortest path to GitHub + Hugging Face publishing
- `docs/model_card.md` — Hugging Face model card draft
- `docs/linkedin_post.md` — LinkedIn post draft

## Recommended learning path

1. Read `configs/project_config.yaml`
2. Read a few examples from `data/seed_dataset.jsonl`
3. Run `scripts/validate_dataset.py`
4. Merge `data/seed_dataset.jsonl` and `data/synthetic_batch_v1.jsonl`
5. Open `notebooks/train_unsloth_colab.ipynb` in Google Colab
6. Run a smoke training pass on a tiny subset
7. Evaluate on `data/eval_prompts.jsonl`
8. Push dataset and model to Hugging Face

The notebook now:
- trains from `data/train_v1_combined.jsonl`
- compares the base model and fine-tuned model on the evaluation prompts
- exports a simple comparison file for manual scoring
- saves the final adapter locally before any optional Hugging Face upload

## Why this setup works on Colab Free

- uses a small instruct student model
- uses LoRA/QLoRA instead of full fine-tuning
- starts with a tiny seed dataset and scales gradually
- saves outputs to Drive or Hugging Face

## Suggested workflow

### Phase 1: Seed dataset
- review and extend the hand-written examples
- keep responses clear, helpful, and calm under pressure
- avoid direct references, quotes, or copied plot text

### Phase 2: Teacher expansion
- use a stronger model to generate more examples in the same schema
- manually review and keep only strong examples
- save accepted rows into a new expanded dataset
- merge accepted rows with `scripts/merge_datasets.py`

### Phase 3: Student tuning
- fine-tune the student with Unsloth in Colab
- compare the base model and tuned model on the evaluation prompts
- iterate on weak areas like tone, structure, and overconfidence

### Phase 4: Portfolio packaging
- publish the dataset
- publish the model or LoRA adapter
- share the learning story on LinkedIn

## Local commands

Validate the dataset:

```bash
python scripts/validate_dataset.py data/seed_dataset.jsonl
```

Preview benchmark prompts:

```bash
python scripts/preview_eval.py data/eval_prompts.jsonl
```

Merge seed and synthetic data:

```bash
python scripts/merge_datasets.py data/seed_dataset.jsonl data/synthetic_batch_v1.jsonl data/train_v1_combined.jsonl
python scripts/validate_dataset.py data/train_v1_combined.jsonl
```

Print a manual scoring worksheet:

```bash
python scripts/score_eval_template.py data/eval_prompts.jsonl
```

## Suggested public naming

- Dataset: `hail-mary-inspired-sci-fi-instruct`
- Model: `hail-mary-inspired-student-lora`

You can rename these later before publishing.

## Fast next step

Use `docs/quick_publish_steps.md` for a minimal copy/paste flow:
- push this local project to GitHub
- clean and re-upload the model repo to Hugging Face
- create and upload the dataset repo

## Use the uploaded model

Published model repo:
- `https://huggingface.co/Stinger2311/hail-mary-inspired-student-lora`

Important:
- this repo contains a LoRA adapter, not a full standalone model
- load the base model first, then load the adapter on top

Recommended base model:
- `unsloth/Qwen2.5-3B-Instruct-bnb-4bit`

### Quick start (Python)

Install dependencies:

```bash
pip install transformers peft accelerate bitsandbytes safetensors
```

Run inference with the adapter:

```python
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
import torch

base_model_id = "unsloth/Qwen2.5-3B-Instruct-bnb-4bit"
adapter_id = "Stinger2311/hail-mary-inspired-student-lora"

tokenizer = AutoTokenizer.from_pretrained(base_model_id)

base_model = AutoModelForCausalLM.from_pretrained(
	base_model_id,
	device_map="auto",
	torch_dtype=torch.float16,
)

model = PeftModel.from_pretrained(base_model, adapter_id)

messages = [
	{"role": "system", "content": "You are a calm science assistant."},
	{"role": "user", "content": "How should a crew handle uncertainty during first contact?"},
]

prompt = tokenizer.apply_chat_template(
	messages,
	tokenize=False,
	add_generation_prompt=True,
)

inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

with torch.no_grad():
	output_ids = model.generate(
		**inputs,
		max_new_tokens=180,
		temperature=0.7,
		do_sample=True,
	)

new_tokens = output_ids[0][inputs["input_ids"].shape[-1]:]
print(tokenizer.decode(new_tokens, skip_special_tokens=True))
```

### Low-memory tips

- keep the 4-bit base model above
- reduce `max_new_tokens` to 64 or 96 if VRAM is tight
- restart the notebook/session and reload fresh if generation state gets unstable

## Create a merged model (for API deployment)

If you want to deploy behind an API endpoint, a merged full model is usually easier to serve than adapter-only weights.

Install merge dependencies:

```bash
pip install transformers peft accelerate safetensors huggingface_hub
```

Create merged model files locally:

```bash
python scripts/merge_lora_model.py \
	--base-model Qwen/Qwen2.5-3B-Instruct \
	--adapter Stinger2311/hail-mary-inspired-student-lora \
	--output-dir outputs/hail_mary_merged_model
```

Create + upload merged model to a new Hugging Face repo in one command:

```bash
python scripts/merge_lora_model.py \
	--base-model Qwen/Qwen2.5-3B-Instruct \
	--adapter Stinger2311/hail-mary-inspired-student-lora \
	--output-dir outputs/hail_mary_merged_model \
	--push-repo-id Stinger2311/hail-mary-inspired-student-merged
```

Then deploy that merged repo using Hugging Face Inference Endpoints and call it from your frontend via a backend API route.

## Demo on Hugging Face Spaces (Option 2)

This repo includes a ready demo app in `space_demo/`.

### 1) Create a new Space

- Go to Hugging Face -> New Space
- Choose SDK: Gradio
- Create a Space repo (for example: `Stinger2311/hail-mary-demo-chat`)

### 2) Upload the Space template files

Upload all files from `space_demo/` to the Space root:
- `space_demo/app.py` -> `app.py`
- `space_demo/requirements.txt` -> `requirements.txt`
- `space_demo/README.md` -> `README.md`

### 3) Set Space secrets

In Space Settings -> Variables and secrets, add:
- `HF_TOKEN` = your Hugging Face token
- `HF_MODEL_ID` = `Stinger2311/hail-mary-inspired-student-merged` (or another deployed model)

Optional vars:
- `SYSTEM_PROMPT`
- `MAX_NEW_TOKENS`
- `TEMPERATURE`
- `TOP_P`

After restart/build, your Space URL becomes your live public demo.
