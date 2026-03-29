# Teacher Expansion Workflow

Use this workflow after the seed dataset looks good.

## Goal

Generate more training examples with a stronger teacher model while keeping quality high and the dataset public-safe.

## Recommended teacher prompt

Ask the teacher to produce rows in the exact schema:

```text
You are generating training data for a small sci-fi reasoning assistant.

Constraints:
- Write fully original text.
- Do not mention Project Hail Mary, Andy Weir, Ryland Grace, Rocky, or any copyrighted quote.
- Keep the tone calm, honest, encouraging, and science-literate.
- Focus on themes like uncertainty, teamwork, survival, first contact, and explanation.
- Return valid JSON with keys: system, user, assistant, tags, difficulty.
```

## Review checklist

Keep a generated sample only if:
- it is original and does not copy known material
- the user prompt is realistic and useful
- the assistant answer is helpful and not overly verbose
- uncertainty is handled honestly
- the tone matches the project style

Reject a sample if:
- it names copyrighted characters or story-specific terms
- it sounds generic and low-effort
- it claims facts without enough evidence
- it is repetitive or too similar to existing rows

## Suggested process

1. Generate 20 to 50 candidate rows
2. Manually review and keep the best 20 to 40 percent
3. Merge with the current accepted dataset using `python scripts/merge_datasets.py data/seed_dataset.jsonl data/synthetic_batch_v1.jsonl data/train_v1_combined.jsonl`
4. Run `python scripts/validate_dataset.py data/train_v1_combined.jsonl`
5. Retrain the student model
6. Re-evaluate on `data/eval_prompts.jsonl`

## Teaching note

This is a practical form of distillation:
- the large model helps create better examples
- the small model learns from those examples
- quality control matters more than raw sample count
