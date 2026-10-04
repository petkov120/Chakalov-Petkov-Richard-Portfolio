import { socialScreens } from '../../ui/projects/social/screens'
import { investmentScreens } from '../../ui/projects/InvestmentUI'
import { notepadScreens } from '../../ui/projects/NotepadUI'

export const interactionProjects = [
  {
    id: 'social', accent: '#1d9bf0', project: 'X redesign', title: 'X, with a little more intention.', name: 'X redesign',
    href: '/interactions/social', mark: '𝕏', status: 'Working prototype', year: '2026',
    category: 'Personal project / Interaction design', posterScreen: 'feed', screens: socialScreens,
    summary: 'A calmer way to discover people, share a thought, and make something worth posting.',
    note: 'Keep the context.\nLose the friction.',
    story: [
      { title: 'Stay in the moment.', focal: 'the conversation', screen: 'profile-peek', body: 'A feed is a place to discover things. Checking who wrote a post should not mean losing the post itself. The profile preview opens over the feed, keeping the conversation in view while identity, context, and a follow action come forward.' },
      { title: 'Give a thought some room.', focal: 'something to say', screen: 'compose-ready', body: 'Composing shifts the attention to writing. Audience and reply permissions stay visible, the keyboard has its own space, and the publish action becomes available when there is something to say. Posting leads back to the feed with clear feedback.' },
      { title: 'A place to make, too.', focal: 'working controls', screen: 'video-studio', body: 'Creator tools connect the account menu to a dedicated studio. The video editor brings trimming, text, image layers, and a moving playhead into that same sequence. These are working controls in the prototype.' },
    ],
    principles: ['Preserve the person’s place.', 'Let motion explain the change.', 'Make the next action clear.'],
    steps: [
      { screen: 'feed', duration: 3200, action: { selector: '[aria-label="Show newest posts"]', after: 1400 } },
      { screen: 'profile-peek', duration: 2800 },
      { screen: 'feed', duration: 1200 },
      { screen: 'compose', duration: 1500 },
      { screen: 'compose-ready', duration: 2800, action: { selector: '.x-compose > header button.is-ready', after: 1900 } },
      { screen: 'published', duration: 2300 },
      { screen: 'account-menu', duration: 1900 },
      { screen: 'creator-studio', duration: 2300 },
      { screen: 'video-studio', duration: 1700, action: { selector: '.x-video__tools button:nth-child(1)', after: 600 } },
      { screen: 'video-studio', duration: 1700, action: { selector: '.x-video__tools button:nth-child(2)', after: 400 } },
      { screen: 'video-studio', duration: 4000, action: { selector: '.x-video__play[aria-label="Play"]', after: 200 } },
    ],
  },
  {
    id: 'investment', accent: '#8b5cf6', project: 'Investment', title: 'A little more confidence.', name: 'Investment',
    href: '/interactions/investment', mark: '↗', status: 'Flow study', year: '2026',
    category: 'Personal project / Product exploration', posterScreen: 'portfolio', screens: investmentScreens,
    summary: 'From noticing a change to understanding it. A study in making one investment decision feel clear.',
    note: 'Clarity before\ncommitment.',
    story: [
      { title: 'Begin with understanding.', focal: 'understand', screen: 'asset-detail', body: 'The flow starts with a person noticing a change in their portfolio. Before asking them to act, it should help them understand their position and why a selected asset’s performance changed.' },
      { title: 'Make the decision legible.', focal: 'before committing', screen: 'review', body: 'Choosing an amount stays separate from reviewing it. The review brings the asset, amount, fee, and resulting position together, so the person can check the decision before committing.' },
      { title: 'End with what changed.', focal: 'what changed', screen: 'confirmed', body: 'Confirmation explains the result: the new share count, when the shares settle, and the cash that remains.' },
    ],
    principles: ['Understanding before action.', 'A distinct moment to review.', 'Confirmation with meaning.'],
    steps: investmentScreens.map(screen => ({ screen: screen.id, duration: screen.id === 'welcome' ? 3400 : 2400 })),
  },
  {
    id: 'notepad', accent: '#d9c7a3', project: 'Notepad', title: 'Catch the thought.', name: 'Notepad',
    href: '/interactions/notepad', mark: 'n.', status: 'Flow study', year: '2026',
    category: 'Personal project / Product exploration', posterScreen: 'notes', screens: notepadScreens,
    summary: 'An idea arrives before it is organised. A quiet little space to catch it, keep it, and find it again.',
    note: 'Write first.\nMake sense of it later.',
    progress: 'This is an early flow study. The current preview maps capturing, organising, and saving a thought; the detailed interface is still being developed.',
    story: [
      { title: 'Before the thought disappears.', focal: 'the thought', screen: 'quick-capture', body: 'Quick capture is the centre of this idea. A writing surface should be immediately available, with controls that make room for the keyboard rather than competing with the thought.' },
      { title: 'Just enough structure.', focal: 'findable', screen: 'organise', body: 'Organisation comes after capture. A tag, pin, or collection should help the note become findable without turning a small thought into an administrative task.' },
      { title: 'A trustworthy return.', focal: 'saved state', screen: 'saved', body: 'Saving leads back to the note in its expected place. The four-state study lays out that journey, from recent notes through capture and organisation to a clear saved state.' },
    ],
    principles: ['Writing stays primary.', 'Structure earns its place.', 'Saving preserves the thought.'],
    steps: notepadScreens.map(screen => ({ screen: screen.id, duration: 2400 })),
  },
]
