# LinkedIn Post Draft

I just finished building a small `Project Hail Mary`-inspired LLM project using **Unsloth + Google Colab + Hugging Face**.

What I wanted to learn:
- how dataset design changes model behavior
- how synthetic-data distillation works in practice
- how far a small model can go on limited hardware

What I built:
- an original sci-fi reasoning dataset
- a small student model fine-tuned with LoRA/QLoRA
- an evaluation set to compare base vs tuned behavior
- a Hugging Face-ready model and dataset release

What made this interesting:
- I had to keep the project **public-safe**, so the dataset is inspired by the themes I loved rather than copying any book or movie text
- I designed it for **free Colab**, which forced me to think carefully about model size, sequence length, checkpoints, and iteration speed
- I treated distillation as **teacher-generated synthetic data + student fine-tuning**

What I learned:
- dataset quality matters more than people expect
- “small but focused” beats “large and messy” for learner projects
- a good benchmark set makes iteration much easier
- optimism and honesty are both trainable style signals

Next step: improve the dataset, run more evaluations, and deploy a cleaner demo.

If you’re learning LLMs and don’t have a powerful laptop, tools like Unsloth and Colab make these projects much more accessible than they seem.

#LLM #MachineLearning #FineTuning #Unsloth #HuggingFace #GoogleColab #AIProjects
