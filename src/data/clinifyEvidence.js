import { campaignWorkflowSlackThread } from './clinifySlackThread'

const memberCommunicationsAnnotations = [
  {
    id: 'quick-actions',
    x: 0.2,
    y: 0.48,
    label: 'Quick Actions',
    body: 'Pick email, SMS, AI Call, or Scheduled at step one. Not halfway through a batch.',
  },
  {
    id: 'ai-call-action',
    x: 0.2,
    y: 0.58,
    label: 'AI Call',
    body: 'Voice lives in the same center as SMS and email. No separate tool.',
  },
  {
    id: 'recent-activity',
    x: 0.68,
    y: 0.52,
    label: 'Recent Activity',
    body: 'One log for SMS, completed calls, and email. Chronological thread history.',
  },
  {
    id: 'nav-comms',
    x: 0.025,
    y: 0.14,
    label: 'Communication hub',
    body: 'The sidebar anchors the center. Care managers stay in one app to change channel.',
  },
]

const memberLookupAnnotations = [
  {
    id: 'search-entry',
    x: 0.38,
    y: 0.22,
    label: 'ID first entry',
    body: 'Care managers arrive with a member ID. Not a scrollable directory. Search is the front door.',
  },
  {
    id: 'assigned-scope',
    x: 0.42,
    y: 0.38,
    label: 'Assigned scope only',
    body: 'Results stay within HIPAA assigned access. The UI never implies you can browse everyone.',
  },
  {
    id: 'member-context',
    x: 0.52,
    y: 0.58,
    label: 'Member record opens',
    body: 'One match, one workflow. Outreach, history, and clinical context attach to the member you looked up.',
  },
]

const callModalAnnotations = [
  {
    id: 'member-identity',
    x: 0.5,
    y: 0.43,
    label: 'Member in context',
    body: 'Avatar, name, and number match the member selected in the list. The modal inherits scope.',
  },
  {
    id: 'end-call',
    x: 0.605,
    y: 0.575,
    label: 'End call',
    body: 'Hard stop for an active AI session. Safety control when human judgment is needed.',
  },
  {
    id: 'minimize-while-active',
    x: 0.555,
    y: 0.305,
    label: 'Minimize while active',
    body: 'Care managers keep working while the AI call runs. Built for desk workflows.',
  },
]

export const clinifyEvidence = {
  opening: {
    overview:
      'Clinify is a care operations platform for health plans and care organizations. Care teams use it to view member context, run outreach campaigns, and coordinate email, SMS, and AI voice from one workspace.',
    problem:
      'Care managers were switching tools to do one job, and every switch invited mistakes. AI voice made outreach faster, but it also raised the stakes. Every flow had to respect HIPAA: assigned access only, no open browse, and a human decision before any patient contact.',
    facts: [
      { label: 'Role', value: 'Founding designer & design engineer' },
      { label: 'Timeline', value: '18 months from MVP to production' },
      { label: 'Team', value: '2 Engineers, 1 PM, me as founding designer' },
      { label: 'Responsibilities', value: 'UX, UI, system design, frontend execution' },
      { label: 'Status', value: 'Shipped to paying enterprise customers' },
    ],
    context:
      'I was the founding designer and later moved into frontend delivery. I owned the experience from research and workflow definition through production UI, working directly with two engineers and one product manager.',
    roleScope: [
      'Owned UX and UI from research to shipped product',
      'Used AI-assisted implementation to move from concepts to production faster',
      'Worked in Git-based workflows with engineering to ship safely',
    ],
    executive: [
      {
        label: 'The mandate',
        title: 'Turn fragmented outreach into one safe workflow.',
        body: 'Care managers were using separate tools for email, SMS, and calling. Clinify needed one operational model without weakening access control or accountability.',
      },
      {
        label: 'My ownership',
        title: 'Research → product model → production frontend.',
        body: 'I defined the interaction model, designed the system, worked through compliance constraints, and helped implement the shipped frontend alongside engineering.',
      },
      {
        label: 'The result',
        title: 'A production platform with paying customers.',
        body: 'In 18 months, the product moved from MVP to a shared communication workspace with email, SMS, and human-approved AI voice.',
      },
    ],
  },
  heroStage: {
    kicker: 'Production today',
    headline: 'Recipient flow with human approval',
    body: 'This is the key workflow. A care manager reviews context and approves before outreach starts.',
    evidence: [
      {
        type: 'shipped',
        figure: '09',
        date: '2026',
        caption: 'AI call recipient flow with approval step before launch.',
        src: '/images/ai-agent-calls.webp',
        alt: 'Clinify AI call screen showing recipient review and approval modal',
        aspect: 'video',
      },
    ],
  },
  cinematic: {
    line: 'One thousand records.',
    punch:
      'Care managers cannot scroll through every patient. HIPAA only allows assigned access. Lookup by member ID.',
  },
  spreads: [
    {
      id: 'problem-table',
      layout: 'stage',
      kicker: 'The constraint',
      body: 'Regulation required recipient level auditability. A browse first list implied access a care manager did not have. The common table pattern was not legally safe for this workflow.',
      evidence: [
        {
          type: 'killed',
          figure: '01',
          date: '2024',
          caption: 'Browse list. Implied access care managers did not have.',
          src: '/images/clinify/deck-member-list.png',
          alt: 'Alignment deck member selection table that implied browse',
          aspect: 'slide',
        },
      ],
    },
    {
      id: 'pause-before-act1',
      layout: 'void',
      size: 'medium',
    },
    {
      id: 'act1-statement',
      layout: 'statement',
      tall: true,
      body: "The list wasn't wrong visually. It was wrong legally.",
    },
    {
      id: 'old-design',
      layout: 'stage',
      kicker: 'Old design',
      body: 'The scrollable table looked fine in review. In real use, it implied broad access. HIPAA required assigned access only.',
      evidence: [
        {
          type: 'killed',
          date: '2024',
          caption: 'Browse list. Killed before production.',
          src: '/images/clinify/deck-member-list.png',
          alt: 'Alignment deck member selection table that implied browse',
          aspect: 'slide',
          expandable: false,
          hideCaption: true,
        },
      ],
    },
    {
      id: 'act1-interstitial',
      layout: 'statement',
      interstitial: true,
      body: 'This looked fine in stakeholder review.',
    },
    {
      id: 'new-design',
      layout: 'stage',
      kicker: 'New design',
      headline: 'ID first lookup replaces browse',
      body: 'Care managers usually start with a member ID. Search became the front door, and results stayed inside assigned scope.',
      evidence: [
        {
          type: 'shipped',
          figure: '02',
          date: '2024',
          caption: 'Member lookup. ID first search replaces browse.',
          src: '/images/Member-ID%20SEARCH.webp',
          alt: 'Clinify production UI for search by assigned member ID',
          aspect: 'video',
          expandHint: 'Guided tour',
          annotations: memberLookupAnnotations,
        },
      ],
    },
    {
      id: 'compliance-resolution',
      layout: 'full',
      body: 'We removed browse. The product now supports assigned search only. One member in context, one workflow.',
    },
    {
      id: 'pause-before-act2',
      layout: 'void',
      size: 'tall',
    },
    {
      id: 'act2-statement',
      layout: 'statement',
      tall: true,
      body: "Speed without accountability isn't adoption. It's risk.",
    },
    {
      id: 'auto-send',
      layout: 'full',
      surface: 'white',
      body: 'Care teams needed a review step before any patient contact. Full automation without review was rejected.',
      evidence: [
        {
          type: 'killed',
          figure: '04',
          date: '2024',
          caption: 'Auto send flow. Rejected concept.',
          src: '/images/clinify/rejected-auto-send.png',
          alt: 'Rejected Clinify concept for fully autonomous AI outreach without human review',
          aspect: 'fourThree',
        },
      ],
    },
    {
      id: 'pause-before-modal',
      layout: 'void',
      size: 'medium',
    },
    {
      id: 'call-modal-hero',
      layout: 'stage',
      stageVariant: 'viewport',
      kicker: 'Human in the loop',
      headline: 'The AI runs the call. A care manager starts it.',
      body: 'A call starts only after a care manager selects the member, reviews the details, and clicks Initiate AI Call. This keeps speed with clear accountability.',
      evidence: [
        {
          type: 'shipped',
          figure: '06',
          date: '2026',
          caption: 'Active call modal. Active call state.',
          src: '/images/clinify/calling-ui.png',
          alt: 'Clinify call modal for active AI voice call UI',
          aspect: 'fourThree',
          expandHint: 'Guided tour',
          annotations: callModalAnnotations,
        },
      ],
    },
    {
      id: 'call-system',
      layout: 'panel',
      title: 'Call State Machine',
      subtitle: 'Invented. No prior visual convention for AI outbound voice.',
      body: 'We defined clear call states for AI voice: connecting, ringing, active, completed, failed. The status language and colors were designed to be clear under clinical pressure.',
      states: [
        { state: 'connecting', color: '#f59e0b' },
        { state: 'ringing', color: '#3b82f6' },
        { state: 'active', color: '#22c55e' },
        { state: 'completed', color: '#6b7280' },
        { state: 'failed', color: '#ef4444' },
      ],
      flow: 'connecting → ringing → active → completed  /  failed → unfinished · rescheduled',
      sources: ['index.css', 'CallUIModal.tsx'],
    },
    {
      id: 'campaign-slack',
      layout: 'slack',
      body: 'Before this shipped, design and engineering aligned on one campaign workflow instead of separate products by channel.',
      evidence: [
        {
          type: 'slack',
          figure: 'S.1',
          date: '2024',
          caption: 'Engineering thread. Campaign first workflow versus separate channel screens.',
          slackThread: campaignWorkflowSlackThread,
        },
      ],
    },
  ],
  decisions: [
    {
      decision: 'Search by assigned member ID instead of exposing a directory.',
      why: 'Care managers arrived with a member ID and were only permitted to access assigned patients. A browse-first table suggested broader access than the workflow allowed.',
      tradeoff: 'We gave up browse and open-ended discovery. That made a valid member ID essential and required clearer empty, invalid, and unauthorized states—but it kept the interface aligned with assigned access.',
      outcome: 'The interface opens one permitted member in context, with outreach and history attached to that record.',
      refs: ['Fig 01', 'Fig 02'],
    },
    {
      decision: 'One communication center instead of three separate tools.',
      why: 'Care managers plan by campaign, not by channel. Separate tools made one task feel like three products.',
      tradeoff: 'A shared hub made the system harder to design and implement: permissions, drafts, delivery states, and history had to work consistently across three channels. Separate tools would have shipped with fewer dependencies.',
      outcome: 'One hub for email, SMS, and AI voice. Teams stopped switching tools mid task.',
      refs: ['Fig S.1', 'Fig 09'],
    },
    {
      decision: 'The AI runs the call. A care manager starts it.',
      why: 'Teams wanted AI speed but could not allow unreviewed patient contact. A human trigger was required.',
      tradeoff: 'Human approval adds time to every campaign and prevents a fully unattended queue. We accepted lower theoretical throughput to preserve recipient review, accountability, and a clear stop point.',
      outcome: 'Care managers control who gets called and when. AI handles script, dialing, and logging after approval.',
      refs: ['Fig 04', 'Fig 06'],
    },
  ],
  engineering: {
    label: 'Engineering decisions',
    items: [
      'React and TypeScript architecture for shared channel workflows in production.',
      'AI assisted implementation to move from product decisions to shipped frontend faster.',
      'Git based workflow for version control, reviews, and safer iteration with engineering.',
      'Permission scoped interaction model and call state logic to keep workflows reliable.',
    ],
  },
  collaboration: {
    label: 'How I worked',
    title: 'Design decisions moved through the product team, not over the wall.',
    body: 'I worked with two engineers and one product manager. We used workflow reviews to align on the operating model, then Git-based delivery to resolve implementation details in the product itself.',
    items: [
      'Product: shaped campaign requirements and customer priorities with the PM.',
      'Engineering: defined shared channel behavior, permission boundaries, and call states together.',
      'Delivery: moved from design artifacts into production frontend, using reviewable Git changes.',
    ],
  },
  results: {
    label: 'Outcomes in production',
    items: [
      {
        value: '2',
        detail: 'Paying B2B customers running this workflow in production',
      },
      {
        value: '3→1',
        detail: 'Three communication channels unified into one workspace',
      },
      {
        value: '18 mo',
        detail: 'Time from MVP to production with AI voice in market',
      },
      {
        value: 'Auditable',
        detail: 'Recipient actions retain a human approval step before patient contact',
      },
      {
        value: 'Human-led',
        detail: 'AI handles execution only after a care manager chooses the recipient and starts the call',
      },
    ],
  },
  notBuilt: [
    {
      title: 'Fully autonomous AI outreach',
      reason:
        'Care teams needed review before any patient contact. Speed without accountability is not adoption. It is risk.',
      seeAlso: 'See Fig 04 and Decision 02.',
    },
  ],
  screenGallery: [
    {
      id: 'member-lookup',
      label: 'Member lookup',
      path: '/clinify/member-search',
      src: '/images/Member-ID%20SEARCH.webp',
      alt: 'Clinify production UI for search by assigned member ID',
      caption: 'Fig. 02 — ID-first search replaces browse.',
    },
    {
      id: 'member-comms',
      label: 'Communications hub',
      path: '/clinify/communications',
      src: '/images/clinify/member-communications.png',
      alt: 'Clinify member communications workspace with email, SMS, and AI call actions',
      caption: 'Fig. 01 — The shared communication workspace.',
    },
    {
      id: 'call-modal',
      label: 'Active call modal',
      path: '/clinify/call',
      src: '/images/clinify/calling-ui.png',
      alt: 'Clinify call modal for active AI voice call UI',
      caption: 'Fig. 06 — Active call state, human in the loop.',
    },
    {
      id: 'call-approval',
      label: 'Recipient approval',
      path: '/clinify/approve',
      src: '/images/ai-agent-calls.webp',
      alt: 'Clinify AI call screen showing recipient review and approval modal',
      caption: 'Fig. 09 — Review before any patient contact.',
    },
    {
      id: 'auto-send-rejected',
      label: 'Auto-send (rejected)',
      path: '/clinify/auto-send',
      src: '/images/clinify/rejected-auto-send.png',
      alt: 'Rejected Clinify concept for fully autonomous AI outreach without human review',
      caption: 'Fig. 04 — Rejected concept, kept for context.',
    },
  ],
  validation:
    'Validation · 2 paying B2B customers · 18 months MVP → production · Email, SMS & AI voice in one production hub',
  closingQuote:
    'Products are not measured by how fast they\'re built. They\'re measured by how confidently people use them, especially when the stakes are human.',
}
