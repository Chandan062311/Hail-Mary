import argparse
from pathlib import Path


def main():
    try:
        from huggingface_hub import HfApi, create_repo, login
    except ModuleNotFoundError as exc:
        raise SystemExit(
            "huggingface_hub is required. Install it with `pip install huggingface_hub`."
        ) from exc

    parser = argparse.ArgumentParser(description="Upload a clean model folder to a Hugging Face model repo.")
    parser.add_argument("--repo-id", required=True, help="Hugging Face model repo ID, e.g. user/name")
    parser.add_argument("--folder", required=True, help="Folder containing cleaned model files")
    parser.add_argument("--token", default=None, help="Optional HF write token")
    args = parser.parse_args()

    folder = Path(args.folder)
    if not folder.exists():
        raise SystemExit(f"folder not found: {folder}")

    if args.token:
        login(args.token)

    create_repo(args.repo_id, repo_type="model", exist_ok=True)

    api = HfApi()
    api.upload_folder(
        folder_path=str(folder),
        repo_id=args.repo_id,
        repo_type="model",
    )
    print(f"model uploaded to https://huggingface.co/{args.repo_id}")


if __name__ == "__main__":
    main()
