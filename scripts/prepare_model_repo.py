import argparse
import shutil
from pathlib import Path


KEEP_FILES = {
    "adapter_config.json",
    "adapter_model.safetensors",
    "tokenizer.json",
    "tokenizer_config.json",
    "special_tokens_map.json",
    "vocab.json",
    "merges.txt",
    "sentencepiece.bpe.model",
    "spiece.model",
    "generation_config.json",
    "chat_template.jinja",
    "README.md",
    ".gitattributes",
    "added_tokens.json",
}

SKIP_PREFIXES = ("checkpoint-",)


def copy_clean_folder(source: Path, destination: Path) -> None:
    if destination.exists():
        shutil.rmtree(destination)
    destination.mkdir(parents=True, exist_ok=True)

    copied = []
    for item in source.iterdir():
        if item.name.startswith(SKIP_PREFIXES):
            continue
        if item.is_dir():
            continue
        if item.name in KEEP_FILES:
            shutil.copy2(item, destination / item.name)
            copied.append(item.name)

    print(f"copied {len(copied)} files to {destination}")
    for name in sorted(copied):
        print(f"- {name}")


def main():
    parser = argparse.ArgumentParser(description="Prepare a clean Hugging Face model upload folder.")
    parser.add_argument("source", help="Path to the saved model folder")
    parser.add_argument("destination", help="Path to the clean output folder")
    args = parser.parse_args()

    source = Path(args.source)
    destination = Path(args.destination)

    if not source.exists():
        raise SystemExit(f"source folder not found: {source}")

    copy_clean_folder(source, destination)


if __name__ == "__main__":
    main()
