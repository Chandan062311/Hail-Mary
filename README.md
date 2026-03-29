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
- `scripts/publish_hf_model.py` — uploads a clean model folder to Hugging Face
- `scripts/publish_hf_dataset.py` — creates and uploads a Hugging Face dataset repo
- `scripts/score_eval_template.py` — prints a manual scoring worksheet
- `notebooks/train_unsloth_colab.ipynb` — main Colab notebook
- `docs/dataset_card.md` — Hugging Face dataset card draft
- `docs/huggingface_cleanup_and_dataset.md` — cleanup and dataset publishing guide
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
