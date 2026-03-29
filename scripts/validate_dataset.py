import json
import sys
from pathlib import Path

REQUIRED_KEYS = {"system", "user", "assistant", "tags", "difficulty"}
RISKY_PHRASES = [
    "project hail mary",
    "andy weir",
    "ryland grace",
    "rocky",
    "quote from the book",
    "quote from the movie",
]


def validate_record(record, index):
    errors = []
    missing = REQUIRED_KEYS - set(record)
    if missing:
        errors.append(f"row {index}: missing keys {sorted(missing)}")

    for key in ("system", "user", "assistant"):
        value = record.get(key, "")
        if not isinstance(value, str) or not value.strip():
            errors.append(f"row {index}: `{key}` must be a non-empty string")

    tags = record.get("tags")
    if not isinstance(tags, list) or not tags or not all(isinstance(tag, str) for tag in tags):
        errors.append(f"row {index}: `tags` must be a non-empty list of strings")

    difficulty = record.get("difficulty")
    if difficulty not in {"easy", "medium", "hard"}:
        errors.append(f"row {index}: `difficulty` must be easy, medium, or hard")

    combined_text = " ".join(str(record.get(key, "")) for key in ("system", "user", "assistant")).lower()
    for phrase in RISKY_PHRASES:
        if phrase in combined_text:
            errors.append(f"row {index}: contains risky franchise-specific phrase `{phrase}`")

    return errors


def main(path_str):
    path = Path(path_str)
    if not path.exists():
        raise SystemExit(f"file not found: {path}")

    errors = []
    rows = 0
    with path.open() as handle:
        for rows, line in enumerate(handle, start=1):
            line = line.strip()
            if not line:
                errors.append(f"row {rows}: empty line")
                continue
            try:
                record = json.loads(line)
            except json.JSONDecodeError as exc:
                errors.append(f"row {rows}: invalid json ({exc})")
                continue
            errors.extend(validate_record(record, rows))

    if rows == 0:
        errors.append("dataset is empty")

    if errors:
        print("Dataset validation failed:")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)

    print(f"Dataset validation passed for {rows} rows in {path}.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("usage: python scripts/validate_dataset.py <dataset.jsonl>")
    main(sys.argv[1])
