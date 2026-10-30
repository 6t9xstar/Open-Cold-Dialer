# Usage

This document covers day-to-day usage of **Open-Cold-Dialer**.

## Installation

Clone the repository and install any dependencies listed in the project root:

```bash
git clone https://github.com/6t9xstar/Open-Cold-Dialer.git
cd Open-Cold-Dialer
```

If the project ships a `requirements.txt`, install it:

```bash
pip install -r requirements.txt
```

## Running

See the README for the entry point and the arguments it accepts.

## Configuration

Configuration is read from environment variables or a local config file where
the project supports it. Never commit real credentials - keep them in a local
`.env` file that is covered by `.gitignore`.

## Troubleshooting

- Check that your Python version matches the one the project targets.
- Re-run with verbose output if the project exposes a verbose flag.
- Open an issue if the problem persists, including the command you ran and the
  full error output.
