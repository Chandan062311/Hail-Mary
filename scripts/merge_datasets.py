import json
import sys
from pathlib import Path


def load_jsonl(path):
    with Path(path).open() as handle:
        return [json.loads(line) for line in handle if line.strip()]


def record_signature(record):
    return (
        record.get("system", "").strip(),
        record.get("user", "").strip(),
        record.get("assistant", "").strip(),
    )


def write_jsonl(path, rows):
    with Path(path).open("w") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")


def main(seed_path, batch_path, output_path):
    merged = []
    seen = set()
    for row in load_jsonl(seed_path) + load_jsonl(batch_path):
        signature = record_signature(row)
        if signature in seen:
            continue
        seen.add(signature)
        merged.append(row)
    write_jsonl(output_path, merged)
    print(f"merged {len(merged)} rows into {output_path}")


if __name__ == "__main__":
    if len(sys.argv) != 4:
        raise SystemExit("usage: python scripts/merge_datasets.py <seed.jsonl> <batch.jsonl> <output.jsonl>")
    main(sys.argv[1], sys.argv[2], sys.argv[3])
