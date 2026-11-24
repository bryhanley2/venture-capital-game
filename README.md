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

## Fund economics

- **2 and 20 over a 10-year life.** LPs commit $50M; the 2% fee is charged quarterly on commitments ($10M total).
- **American (deal-by-deal) waterfall.** The GP takes 20% carry on each exit's profit, with a whole-fund clawback test at year 10. No hurdle.
- **Optional GP commitment** (0–5% of the fund) from $2.5M of personal capital, invested alongside LPs with no fees or carry.
- **Gross and net scoring.** Gross MOIC and IRR, plus net TVPI, DPI and IRR to LPs, a J-curve, and an LP view tab.

## How a quarter plays

- **Pitch day.** Founders pitch one at a time: pass, pass and refer, take a diligence call, or invest.
- **Rounds run on a clock.** Demand sets the schedule. Hot rounds step the cap up every two weeks (for example $10M, then $14M, then $20M) and close fast. Each diligence call takes about two weeks, so diligence costs price and sometimes the deal.
- **Price moves.** With no lead you can propose a lower cap; cold rounds can be left open and may come back cheaper next quarter, or fill without you.
- **Relationships.** Four fictional co-investor funds and a founder reputation score. Close relationships hold your allocation at the first-close cap in hot rounds, bring referred deals, and help portfolio companies raise.
- **Board decisions.** Pro-rata, bridges and acquisition offers (sell or hold out).

## Teaching layer

- **Class session mode** (default) fits a 60–90 minute class; **Full fund** plays all forty quarters.
- **Teaching moments**: fourteen concepts, each shown the first time it comes up, using the student's own numbers and ending with a discussion question.
- **Field notes**: practitioner notes from the author's Venture Institute (Decile Group, Cohort 7) work and fund experience, written in the author's own words, shown in the Notebook and on teaching cards.
- **Notebook** tab (lessons, field notes, glossary, fund log) and a discussion guide in the year-10 report.

## Benchmarks and calibration

The end screen compares net IRR with real funds: Carta VC Fund Performance Report, Q1 2025 (2017 vintage) — bottom quartile 5.0%, median 11.5%, top quartile 18.7%, top decile 28.3% — and the S&P 500 10-year return of 13.6% (Cambridge Associates, H1 2025). Deal outcomes are compared with the Correlation Ventures mix: 35% total loss, 29% below cost, 22% at 1–3x, 14% at 3x+.

Company outcomes are tuned with the `CAL` table in `index.html`. To check calibration after a change:

```bash
node tools/calibrate.js index.html 300
```

## Project layout

- `index.html` — the whole game (markup, styles and script in one file)
- `tools/calibrate.js` — batch simulator that measures outcomes against the benchmarks

## Live version

The published copy lives as a Claude artifact: https://claude.ai/artifact/8NNMHZC59XXXLUxNKwX5oV

Changes made in this repo don't update that link automatically — bring the updated `index.html` back to Claude to republish it.
