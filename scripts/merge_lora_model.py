import argparse
from pathlib import Path


def parse_dtype(dtype_name: str):
    import torch

    mapping = {
        "float16": torch.float16,
        "bfloat16": torch.bfloat16,
        "float32": torch.float32,
        "auto": "auto",
    }
    if dtype_name not in mapping:
        raise ValueError(f"unsupported dtype: {dtype_name}")
    return mapping[dtype_name]


def main():
    parser = argparse.ArgumentParser(
        description="Merge a LoRA adapter into a full base model for production deployment."
    )
    parser.add_argument(
        "--base-model",
        default="Qwen/Qwen2.5-3B-Instruct",
        help="Full base model repo used for merge (non-quantized recommended).",
    )
    parser.add_argument(
        "--adapter",
        default="Stinger2311/hail-mary-inspired-student-lora",
        help="LoRA adapter repo or local path.",
    )
    parser.add_argument(
        "--output-dir",
        default="outputs/hail_mary_merged_model",
        help="Where to save merged model files.",
    )
    parser.add_argument(
        "--torch-dtype",
        default="float16",
        choices=["float16", "bfloat16", "float32", "auto"],
        help="Data type used when loading the base model.",
    )
    parser.add_argument(
        "--device-map",
        default="auto",
        help="Transformers device_map value. Use 'auto' for most cases.",
    )
    parser.add_argument(
        "--push-repo-id",
        default=None,
        help="Optional HF model repo id to upload merged model, e.g. user/model-name.",
    )
    parser.add_argument(
        "--private",
        action="store_true",
        help="Create push target as private if --push-repo-id is provided.",
    )
    parser.add_argument(
        "--token",
        default=None,
        help="Optional HF write token. If omitted, uses current cached login.",
    )
    args = parser.parse_args()

    try:
        from peft import PeftModel
        from transformers import AutoModelForCausalLM, AutoTokenizer
    except ModuleNotFoundError as exc:
        raise SystemExit(
            "Missing dependencies. Install with: pip install transformers peft accelerate safetensors"
        ) from exc

    dtype = parse_dtype(args.torch_dtype)

    print(f"Loading base model: {args.base_model}")
    base_model = AutoModelForCausalLM.from_pretrained(
        args.base_model,
        torch_dtype=dtype,
        device_map=args.device_map,
        low_cpu_mem_usage=True,
    )

    print(f"Loading adapter: {args.adapter}")
    model = PeftModel.from_pretrained(base_model, args.adapter)

    print("Merging adapter into base model...")
    merged_model = model.merge_and_unload()

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"Saving merged model to: {output_dir}")
    merged_model.save_pretrained(
        output_dir,
        safe_serialization=True,
        max_shard_size="2GB",
    )

    # Prefer adapter tokenizer files if present; fallback to base model tokenizer.
    try:
        tokenizer = AutoTokenizer.from_pretrained(args.adapter)
    except Exception:
        tokenizer = AutoTokenizer.from_pretrained(args.base_model)
    tokenizer.save_pretrained(output_dir)

    if args.push_repo_id:
        try:
            from huggingface_hub import HfApi, create_repo, login
        except ModuleNotFoundError as exc:
            raise SystemExit(
                "huggingface_hub is required for upload. Install with: pip install huggingface_hub"
            ) from exc

        if args.token:
            login(args.token)

        create_repo(args.push_repo_id, repo_type="model", private=args.private, exist_ok=True)
        api = HfApi()
        print(f"Uploading merged model to: {args.push_repo_id}")
        api.upload_folder(
            folder_path=str(output_dir),
            repo_id=args.push_repo_id,
            repo_type="model",
        )
        print(f"Uploaded: https://huggingface.co/{args.push_repo_id}")

    print("Done.")


if __name__ == "__main__":
    main()
