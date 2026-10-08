# PickPop

An American English shopping inspiration prototype with a colorful original design, a budget-first idea finder, category filters, locally saved favorites, and three editorial guides.

The existing project is in [`pickpop-site/`](pickpop-site/). See its [README](pickpop-site/README.md) for features, local testing, and prototype limitations.

## Local preview

On Windows, double-click `pickpop-site/start-local.cmd`. It uses an available Python 3 installation or the runtime bundled with the Codex desktop app.

Alternatively:

```bash
cd pickpop-site
python serve.py
```

Open http://127.0.0.1:8080. The preview runs only on your computer. No build step is needed.

## Project contents

- `pickpop-site/`: reviewed HTML, CSS, JavaScript, guides, local launcher, and browser regression checks.
- `pickpop-site-v1.zip`: the unchanged original prototype archive.

The catalog contains 20 illustrative shopping ideas and planning budgets. It does not provide verified products, current prices, a live Amazon API, or affiliate tracking. Amazon buttons open ordinary retail searches.

Uploading this repository does not deploy the website. Publishing requires the project owner's separate authorization.
