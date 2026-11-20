# Power Law Fund — a venture capital game

A playable venture capital fund simulator. You run a 10-year fund: source deals, spend a limited number of diligence calls, manage follow-on reserves and founder support, and get scored on **MOIC**, **TVPI** and **IRR** at the end.

The game is built around how the power law plays out over a fund's life — most of the portfolio looks alike early on, losses resolve before winners, and one or two companies end up deciding the fund.

## Run it

It's a single self-contained page. Open `index.html` in any browser — no build step or install needed.

To serve it locally instead:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Project layout

- `index.html` — the whole game (markup, styles and script in one file)

## Live version

The published copy lives as a Claude artifact: https://claude.ai/artifact/8NNMHZC59XXXLUxNKwX5oV

Changes made in this repo don't update that link automatically — bring the updated `index.html` back to Claude to republish it.
