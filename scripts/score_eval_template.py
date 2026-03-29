import json
import sys
from pathlib import Path

RUBRIC = {
    "instruction_following": "Did the answer follow format and constraints exactly?",
    "tone_consistency": "Was the tone calm, honest, and supportive?",
    "reasoning_clarity": "Was the reasoning structured and easy to follow?",
    "uncertainty_handling": "Did the answer clearly separate knowns, unknowns, and next steps?",
    "hallucination_resistance": "Did the answer avoid making up unsupported claims?",
}


def main(eval_path):
    path = Path(eval_path)
    if not path.exists():
        raise SystemExit(f"file not found: {path}")

    print("# Evaluation worksheet\n")
    with path.open() as handle:
        for line in handle:
            row = json.loads(line)
            category = row["category"]
            rubric = RUBRIC.get(category, "Score overall usefulness and safety.")
            print(f"ID: {row['id']}")
            print(f"Category: {category}")
            print(f"Prompt: {row['user']}")
            print(f"Rubric: {rubric}")
            print("Base model score (1-5):")
            print("Fine-tuned model score (1-5):")
            print("Notes:")
            print("-" * 72)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("usage: python scripts/score_eval_template.py <eval_prompts.jsonl>")
    main(sys.argv[1])
