---
language:
  - en
pipeline_tag: text-generation
library_name: transformers
license: apache-2.0
base_model: Qwen/Qwen2.5-3B-Instruct
tags:
  - qwen2.5
  - merged-model
  - sci-fi
  - instruction-tuning
  - educational
model-index:
  - name: hail-mary-inspired-student-merged
    results: []
---

# Hail Mary Inspired Student (Merged)

This is a merged, full-weight model produced from:

- Base model: `Qwen/Qwen2.5-3B-Instruct`
- LoRA adapter: `Stinger2311/hail-mary-inspired-student-lora`

The objective is a calm, science-literate assistant style inspired by first-contact and high-uncertainty problem-solving themes, trained on original (public-safe) instruction data.

## Intended use

- Educational demos and portfolio projects
- Prompted reasoning and explanation tasks
- Lightweight experiments with a themed assistant persona

## Not intended use

- High-stakes decisions (medical, legal, safety-critical)
- Claims of factual authority without external verification
- Any official franchise affiliation or licensed reproduction

## Quickstart (Transformers)

```python
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

model_id = "Stinger2311/hail-mary-inspired-student-merged"

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    dtype=torch.float16,
    device_map="auto",
)

prompt = (
    "System: You are a calm, science-literate assistant. "
    "Be explicit about uncertainty when evidence is incomplete.\n\n"
    "User: How should a crew handle uncertainty during first contact?\n\n"
    "Assistant:"
)

inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
with torch.no_grad():
    out = model.generate(
        **inputs,
        max_new_tokens=180,
        temperature=0.7,
        top_p=0.9,
        do_sample=True,
    )

reply_ids = out[0][inputs["input_ids"].shape[-1]:]
print(tokenizer.decode(reply_ids, skip_special_tokens=True))
```

## Prompting tips

- Use an explicit system instruction for tone and uncertainty handling.
- Ask for structured outputs when you need consistency.
- For safer behavior, request assumptions and confidence levels in the response.

## Training lineage

This merged model comes from a LoRA fine-tuning workflow using:

- Original seed + synthetic reviewed instruction data
- Unsloth/QLoRA style tuning workflow
- Adapter merge into full weights for easier deployment

Related assets:

- Adapter model: `Stinger2311/hail-mary-inspired-student-lora`
- Dataset: `Stinger2311/hail-mary-inspired-sci-fi-instruct`
- Source repo: `https://github.com/Chandan062311/Hail-Mary`

## Limitations

- May hallucinate scientific details.
- Performance depends heavily on prompt quality.
- Not benchmarked for safety-critical production use.

## Safety note

Outputs should be reviewed by a human before use in consequential contexts. For public demos, present this model as an educational themed assistant, not an authority system.
