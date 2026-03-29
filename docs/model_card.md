# Model Card — Hail Mary Inspired Student LoRA

## Overview

This model is a small instruction-tuned student model adapted using Unsloth and LoRA/QLoRA on a custom sci-fi reasoning dataset.

## Base model

Recommended default:
- `unsloth/Qwen2.5-3B-Instruct-bnb-4bit`

You may replace this with another small instruct model if Colab availability changes.

## Training objective

The goal is not franchise mimicry. The goal is a calm, science-literate assistant that handles:
- constrained problem-solving
- uncertainty communication
- teamwork guidance
- first-contact style reasoning
- optimistic but honest support

## Training data

The model is trained on original theme-inspired data and optionally expanded with teacher-generated synthetic examples that are manually reviewed.

## Intended use

- portfolio demo
- educational fine-tuning
- low-compute assistant experimentation

## Limitations

- may hallucinate scientific details
- should not be used for medical, legal, or safety-critical decisions
- inherits limitations from the base model
- theme fidelity depends on dataset quality and evaluation rigor

## Evaluation

Evaluate against the prompts in `data/eval_prompts.jsonl` and compare:
- base model
- fine-tuned LoRA model
- optional merged model

Track:
- instruction following
- reasoning clarity
- calmness under uncertainty
- refusal quality when information is insufficient

## Public positioning

Use phrasing like:

`A Project Hail Mary-inspired sci-fi reasoning assistant trained on original data.`

Avoid phrasing that implies official or licensed content.
