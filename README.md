# Gallery — select multiple images at once

3 files. Apply after all previous zips (all three overlap and these are newest).

Verified: `next build` compiles, `tsc` 0 errors, `eslint` 0 errors.

## What was wrong

`MediaPickerModal` only ever did single-select — one click fired `onSelect` and
closed the modal. That's right for a cover image or a screenshot, where there's
one field to fill. It's wrong for a gallery, where you're adding eight images
and had to reopen the library eight times.

## What changed

The picker now has a `multiple` mode, and the gallery button uses it:

- **Click toggles** instead of closing.
- **Selected images are numbered**, not ticked — in a gallery, the order you
  pick them in is the order they render, so a tick would hide information you
  need.
- **Footer shows the count** with **Add N images** and **Clear**.
- **Uploads join the selection** rather than closing the modal. Upload five
  files, they're all selected, add them in one go.

Everything else is unchanged. Cover Image, Full-Page Screenshot and the block
image fields still open in single-select and close on click — `multiple`
defaults to `false`, so every other call site behaves exactly as before.

## Check after deploy

- Admin → Portfolio → a project → Gallery → **Library**
- Select several; confirm they number 1, 2, 3 in click order
- **Add N images** — all appear in the gallery, in that order
- Upload two new files while the modal is open; they should be auto-selected
- Cover Image → **Library** — should still close on a single click
