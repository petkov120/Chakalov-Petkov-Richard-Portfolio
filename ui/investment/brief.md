# Investment interaction

## Story

A person notices a change in their portfolio, understands why it happened, and makes one confident investment decision.

## Recommended flow

1. `01-portfolio` — total balance, meaningful change, and a short holdings list.
2. `02-asset-detail` — one selected asset with performance context, not chart decoration.
3. `03-order` — amount entry with the effect on available cash made explicit.
4. `04-review` — asset, amount, fee, and resulting position in one calm summary.
5. `05-confirmed` — unmistakable success with a useful next action.

## Interaction to record

Open an asset → choose Invest → enter an amount → review → confirm.

## Design test

- Money and gain/loss values remain legible at phone-gallery size.
- Green is not the only indication of positive performance.
- The confirmation explains what changed, not merely “Success.”

