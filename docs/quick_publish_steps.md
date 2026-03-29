# Quick Publish Steps (Copy/Paste)

This guide is intentionally short and step-by-step.

## 1) Push this project to GitHub

You already have local commits. Do this next:

1. Create an empty GitHub repo in the browser (no README, no .gitignore).
2. Copy the repo URL.
3. Run these commands in this project folder.

```bash
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
git push -u origin main
```

If Git asks for credentials:
- Username: your GitHub username
- Password: use a GitHub Personal Access Token (PAT), not your account password

## 2) Clean model files before re-uploading to Hugging Face

Use the model output folder from Colab or local training output.

```bash
python scripts/prepare_model_repo.py <SOURCE_MODEL_FOLDER> <CLEAN_MODEL_FOLDER>
```

Example:

```bash
python scripts/prepare_model_repo.py /content/drive/MyDrive/hail_mary_lora_output /content/drive/MyDrive/hail_mary_lora_clean
```

## 3) Upload clean model folder to Hugging Face

Install dependency once:

```bash
pip install huggingface_hub
```

Upload:

```bash
python scripts/publish_hf_model.py \
  --repo-id Stinger2311/hail-mary-inspired-student-lora \
  --folder <CLEAN_MODEL_FOLDER> \
  --token <HF_WRITE_TOKEN>
```

## 4) Create and upload the dataset repo

Suggested repo:
- `Stinger2311/hail-mary-inspired-sci-fi-instruct`

Upload train + eval + README from dataset card:

```bash
python scripts/publish_hf_dataset.py \
  --repo-id Stinger2311/hail-mary-inspired-sci-fi-instruct \
  --train-file data/train_v1_combined.jsonl \
  --eval-file data/eval_prompts.jsonl \
  --dataset-card docs/dataset_card.md \
  --token <HF_WRITE_TOKEN>
```

## 5) Final polish on Hugging Face pages

After upload, open both repos on Hugging Face and verify:
- model README has clean description and usage example
- dataset README includes scope, schema, and safety notes
- no checkpoint files are present in the model repo

## Optional: If `git push` still fails

Run these checks:

```bash
git remote -v
git status
git branch --show-current
```

Then retry:

```bash
git push -u origin main
```
