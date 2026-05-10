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
      'Waited too long and every AI component locks in a wrong assumption. Defined the token system at three screens — no reference existed for AI UI patterns, so I had to invent the conventions before I had enough screens to extract them from.',
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
    signals: ['10 million records in the live system', 'HIPAA: care managers can\'t browse other patients\'s records', 'a list would have been a compliance failure'],
    decision:
      'The obvious answer was a list. With 10 million records and a HIPAA boundary, a list is a compliance failure. I had to understand the data model before I could design the entry point. ID-first wasn\'t a UX preference — it was the only shape the constraint allowed.',
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
    signals: ['email, SMS, and AI voice calls from one flow', 'care managers scheduling across large member cohorts', 'mid-flow decisions caused full reruns'],
    decision:
      'Channel selection mid-batch sounds logical until a care manager changes their mind after building a large AI voice schedule. I learned that by watching it happen. Moved the decision to step one — channel first, then everything else follows from that choice.',
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
    signals: ['thousands of simulation runs as raw output', 'care leads presenting to CFOs in 2-minute windows', 'a data table is not a decision tool'],
    decision:
      'The simulation output was a decision tool for people who had two minutes in a meeting. I worked with the researcher to understand what the distribution was saying, then shaped the interface around the numbers that drove the decision — not the full export. The engineers built the model. I made sure the right numbers were visible.',
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
