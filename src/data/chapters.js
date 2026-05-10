export const chapters = [
  {
    number: '01',
    title: 'A design system from three screens',
    paragraphs: [
      'No design system, no brand, no workflows. I designed the brand and identity, built the color system, and shaped the workflows that shorten everyday clinical work.',
      'The AI integrations had no visual conventions yet, so I had to invent the patterns instead of referencing them.',
    ],
    images: [
    ],
    decision:
      'I committed to a design system at three screens because consistency debt was already forming, and every later feature shipped faster for it.',
  },
  {
    number: '02',
    title: 'Designing for 10 million records',
    paragraphs: [
      '10 million member records across the live system. Surfacing them in a single view was never going to work, technically or cognitively.',
      'I rebuilt the entry point around search and unique identifiers: Member ID lookup first, advanced search and recent searches as fallbacks. Data weight became a design constraint, not just an engineering one.',
    ],
    images: [
      {
        src: '/images/Member-ID%20SEARCH.webp?v=3',
        label: 'Member Search, ID first lookup',
        hint: 'public/images/Member-ID SEARCH.webp',
        alt: 'Member Search screen with ID first lookup',
        caption: 'Member Search, ID first lookup',
      },
      {
        src: '/images/member-overview-dark.webp?v=3',
        label: 'Member Overview, profile and activity',
        hint: 'public/images/member-overview-dark.webp',
        alt: 'Member overview screen with profile and activity',
        caption: 'Member Overview, profile and activity',
      },
      {
        src: '/images/member-overview-light.webp?v=3',
        label: 'Member Overview, light mode',
        hint: 'public/images/member-overview-light.webp',
        alt: 'Member overview screen in light mode',
        caption: 'Member Overview, light mode',
      },
    ],
    decision:
      'ID first search came from a security need: users could not be allowed to browse other members records. The guardrail kept lookup fast for care teams.',
  },
  {
    number: '03',
    title: 'Member communications across every channel',
    paragraphs: [
      'Care managers needed to reach members through email, SMS, AI agent voice calls via Twilio, and notifications, scheduled across large batches. I designed the full flow: channel selection, batch scheduling, assignment, and the AI agent call review interface.',
      'Working with the AI researcher on call scripts taught me about ingestions and stored procedures. That changed every modal I designed after, because heavy data underneath demands an interface that respects it.',
    ],
    images: [
      {
        src: '/images/schedule-batch.webp?v=3',
        label: 'Schedule Batch, channel selection',
        hint: 'public/images/schedule-batch.webp',
        alt: 'Schedule batch screen with channel selection options',
        caption: 'Schedule Batch, channel selection',
      },
      {
        src: '/images/ai-agent-calls.webp?v=3',
        label: 'AI Agent Calls, review queue',
        hint: 'public/images/ai-agent-calls.webp',
        alt: 'AI agent calls queue with call preparation dialog',
        caption: 'AI Agent Calls, review queue',
      },
    ],
    decision:
      'I put channel selection first so teams made one clear decision up front, then moved through scheduling without doubting each step.',
  },
  {
    number: '04',
    title: 'From Figma into production',
    paragraphs: [
      'Figma became a bottleneck. Handoff was getting expensive and collaboration on long flows broke down.',
      'I learned HTML, CSS, and React inside the live codebase. Components and state management clicked once I saw them as design layers. Now I ship features one at a time, directly to production.',
    ],
    images: [],
    decision:
      'I learned to code because the dev team was focused on API and data systems, so I took ownership of the product face and unblocked the front end myself.',
  },
  {
    number: '05',
    title: 'Translating ML into trusted UI',
    paragraphs: [
      'I was given two of the harder features: the Health Resource Allocation tool and the ROI Simulator. The first runs bottleneck analysis across roles like Care Managers, Pharmacists, PCPs, and Community Health Workers. The second runs Monte Carlo simulations on net savings, ROI, hospital admissions avoided, and capacity needed.',
      'I designed both by working closely with the AI researcher and clinical advisors. The interface is a translation layer: take dense, statistical, healthcare economics output, make it readable to a care lead who has to decide in two minutes.',
    ],
    images: [
      {
        src: '/images/health-allocation.webp?v=3',
        label: 'Health Resource Allocation, optimization view',
        hint: 'public/images/health-allocation.webp',
        alt: 'Health resource allocation optimization dashboard',
        caption: 'Health Resource Allocation, optimization view',
      },
      {
        src: '/images/roi-simulator.webp?v=3',
        label: 'ROI Simulator, Monte Carlo distribution',
        hint: 'public/images/roi-simulator.webp',
        alt: 'ROI simulator with Monte Carlo net savings distribution chart',
        caption: 'ROI Simulator, Monte Carlo distribution',
      },
    ],
    decision:
      'I showed the Monte Carlo output as a chart instead of a table. Decision makers needed to read uncertainty at a glance, and the visual built trust faster without changing the math.',
  },
  {
    number: '06',
    title: 'Where it is now',
    paragraphs: [
      'Two paying B2B companies and active pilots. The design system covers admin web, a patient facing Android app I also designed, and the Member Experience internal assistant. I own the UI system end to end and contribute to the production codebase.',
      'If I were rebuilding from scratch, I would push harder on empty states and the voice agent UX. There is still a gap between how patients experience an AI call and how care managers review one. That is the next chapter.',
      'This one was about going from zero to a working, paid, used product. I did that.',
    ],
    images: [],
    decision:
      'Eighteen months. Zero to paying customers. Brand, system, and shipped features owned end to end.',
  },
]
