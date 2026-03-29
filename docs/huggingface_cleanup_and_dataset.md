# Hugging Face Cleanup and Dataset Publish

## What can be done from here

From this local project, I can make the notebook, helper scripts, and docs cleaner and easier to follow. I cannot directly control your live Colab session or your authenticated Hugging Face account from here.

The cleanest workflow is:
- train in Colab
- save the final adapter to Drive
- later upload from a fresh session using the helper scripts or the Hugging Face web UI

## Clean the model repo

Your first upload included training checkpoints and optimizer state. That is normal for a first pass, but for a cleaner public repo you usually want only:
- adapter weights
- adapter config
- tokenizer files
- model card

### In Colab or a clean Python environment

Prepare a clean upload folder:

```bash
python scripts/prepare_model_repo.py /content/hail-mary-student-lora /content/hail-mary-student-lora-clean
```

Upload the clean folder:

```bash
python scripts/publish_hf_model.py --repo-id Stinger2311/hail-mary-inspired-student-lora --folder /content/hail-mary-student-lora-clean
```

If you want to remove older files from the Hugging Face repo later, the easiest path is:
- create a second clean repo, or
- delete unwanted files from the Hugging Face web UI

## Publish the dataset repo

Use the combined training set and evaluation prompts:

```bash
python scripts/publish_hf_dataset.py --repo-id Stinger2311/hail-mary-inspired-sci-fi-instruct
```

This uploads:
- `data/train_v1_combined.jsonl`
- `data/eval_prompts.jsonl`
- a `README.md` generated from `docs/dataset_card.md`

## Recommended next session

When you come back later, aim for this small checklist:

1. Open a fresh Colab session
2. Mount Drive
3. Confirm the saved adapter folder exists
4. Run the clean upload script for the model
5. Run the dataset publish script
6. Update the Hugging Face model and dataset cards

## Suggested final public links

- Model: `https://huggingface.co/Stinger2311/hail-mary-inspired-student-lora`
- Dataset: `https://huggingface.co/datasets/Stinger2311/hail-mary-inspired-sci-fi-instruct`
