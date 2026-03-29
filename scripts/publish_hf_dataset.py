import argparse
from pathlib import Path


def build_readme(dataset_card_path: Path, train_path: Path, eval_path: Path) -> str:
    card = dataset_card_path.read_text().strip()
    appendix = f"""

## Files

- `{train_path.name}` — combined training dataset
- `{eval_path.name}` — fixed evaluation prompt set
"""
    return card + appendix + "\n"


def main():
    try:
        from huggingface_hub import HfApi, create_repo, login
    except ModuleNotFoundError as exc:
        raise SystemExit(
            "huggingface_hub is required. Install it with `pip install huggingface_hub`."
        ) from exc

    parser = argparse.ArgumentParser(description="Create and upload a Hugging Face dataset repo.")
    parser.add_argument("--repo-id", required=True, help="Hugging Face dataset repo ID, e.g. user/name")
    parser.add_argument("--train-file", default="data/train_v1_combined.jsonl")
    parser.add_argument("--eval-file", default="data/eval_prompts.jsonl")
    parser.add_argument("--dataset-card", default="docs/dataset_card.md")
    parser.add_argument("--token", default=None, help="Optional HF write token")
    args = parser.parse_args()

    train_path = Path(args.train_file)
    eval_path = Path(args.eval_file)
    dataset_card_path = Path(args.dataset_card)

    for path in (train_path, eval_path, dataset_card_path):
        if not path.exists():
            raise SystemExit(f"missing file: {path}")

    if args.token:
        login(args.token)

    create_repo(args.repo_id, repo_type="dataset", exist_ok=True)

    api = HfApi()
    api.upload_file(
        path_or_fileobj=str(train_path),
        path_in_repo=train_path.name,
        repo_id=args.repo_id,
        repo_type="dataset",
    )
    api.upload_file(
        path_or_fileobj=str(eval_path),
        path_in_repo=eval_path.name,
        repo_id=args.repo_id,
        repo_type="dataset",
    )
    readme_text = build_readme(dataset_card_path, train_path, eval_path)
    api.upload_file(
        path_or_fileobj=readme_text.encode("utf-8"),
        path_in_repo="README.md",
        repo_id=args.repo_id,
        repo_type="dataset",
    )
    print(f"dataset uploaded to https://huggingface.co/datasets/{args.repo_id}")


if __name__ == "__main__":
    main()
