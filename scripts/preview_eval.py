import json
import sys
from pathlib import Path


def main(path_str):
    path = Path(path_str)
    if not path.exists():
        raise SystemExit(f"file not found: {path}")

    with path.open() as handle:
        for line in handle:
            record = json.loads(line)
            print(f"[{record['id']}] {record['category']}")
            print(record["user"])
            print("-" * 60)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("usage: python scripts/preview_eval.py <eval_prompts.jsonl>")
    main(sys.argv[1])
