# X mobile redesign

## Story

A person scans a dense feed, checks who an unfamiliar author is without losing their place,
then writes and publishes a post with confidence.

## Recommended flow

1. `00-splash` — a minimal branded entry state that resolves quickly into the feed.
2. `01-feed` — a calmer For You feed with stronger post grouping and navigation hierarchy.
3. `02-profile-peek` — a compact author card opened directly over the feed.
4. `03-profile-expanded` — optional expanded card showing credibility, context, and follow action.
5. `04-compose` — focused composer with audience, media, and reply-permission controls.
6. `05-compose-ready` — entered text makes the publish action active and unambiguous.
7. `06-published` — confirmation returns the person to the same feed position with the new post visible.

## Interaction to record

Tap an author → inspect the profile preview → dismiss it → open the composer → write a short
post → publish → return to the feed without losing position.

## Interaction details

### Profile preview

- Opens from an avatar or author name without navigating away.
- Keeps enough of the feed visible to preserve context.
- Prioritises identity, biography, location, follower context, and Follow.
- Offers a clear route to the full profile.
- Dismisses by tapping outside or swiping down.

### Composer

- Audience and reply permissions are visible but secondary to writing.
- The publish control clearly moves from disabled to ready.
- Media tools remain reachable without competing with the text field.
- Keyboard appearance should not cause controls to jump unpredictably.

### Publish feedback

- Confirms that the post is live.
- Places it into the feed without resetting scroll position.
- Avoids a generic success modal that blocks the content.

## Design test

- Can someone understand post boundaries while scrolling quickly?
- Does the profile preview answer “who is this?” without requiring navigation?
- Is the composer calm when the keyboard occupies half the screen?
- Are disabled, ready, publishing, and published states visibly different?
- Does the user retain their feed position throughout the entire flow?

## Reference observations

The supplied X screenshots are behavioural references, not a visual specification. Preserve the
useful ideas—the feed context behind the profile card, the dedicated composer, and persistent
navigation—while redesigning spacing, hierarchy, typography, and state feedback in your own style.
