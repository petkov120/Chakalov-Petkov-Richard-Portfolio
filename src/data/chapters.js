export const chapters = [
  {
    number: '01',
    title: 'Starting from zero',
    paragraphs: [
      'When I joined there was no design system, no brand, no workflows. Just a belief that healthcare conversations could be made easier for the people running insurance programs and care management teams.',
      'My first job was to give the product a face. I designed the brand and identity, built the color system, and shaped the workflows that would shorten everyday clinical work.',
      'It was slow at the start. Every component had to be built from scratch. Worse, the AI integrations didn\u2019t have visual conventions yet \u2014 patterns I had to invent rather than reference.',
    ],
    images: [
    ],
    decision:
      'Committing to a design system when there were only three screens to apply it to. Every later decision moved faster because of it.',
  },
  {
    number: '02',
    title: 'Designing for 10 million records',
    paragraphs: [
      'The platform deals with real patient data at scale \u2014 10 million member records across the live system.',
      'I tried to surface all members in a single view. The first round of feedback made it obvious that wasn\u2019t going to work, technically or cognitively.',
      'So I rebuilt the entry point around search and unique identifiers \u2014 Member ID lookup, advanced search, recent searches, and a fallback "search without ID" path for the common case where care managers don\u2019t have one handy.',
      'The pattern looks simple now. Getting there meant accepting that data weight is a design constraint, not just an engineering one.',
    ],
    images: [
      {
        src: '/images/Member-ID%20SEARCH.png?v=2',
        label: 'Member Search — ID-first lookup',
        hint: 'public/images/Member-ID SEARCH.png',
        alt: 'Member Search screen with ID-first lookup',
        caption: 'Member Search — ID-first lookup',
      },
      {
        src: '/images/member-overview-dark.png?v=2',
        label: 'Member Overview — profile and activity',
        hint: 'public/images/member-overview-dark.png',
        alt: 'Member overview screen with profile and activity',
        caption: 'Member Overview — profile and activity',
      },
      {
        src: '/images/member-overview-light.png?v=2',
        label: 'Member Overview — light mode',
        hint: 'public/images/member-overview-light.png',
        alt: 'Member overview screen in light mode',
        caption: 'Member Overview — light mode',
      },
    ],
    decision:
      'Making ID-first search the primary path with name/advanced search as a secondary tab \u2014 instead of dumping every filter on the user upfront.',
  },
  {
    number: '03',
    title: 'Member Communications',
    paragraphs: [
      'I was handed a PowerPoint and told to make it a feature.',
      'Care managers needed to reach members through email, SMS, AI agent voice calls via Twilio, and notifications \u2014 and schedule all of it across large member batches. I designed the full thing: channel selection, batch scheduling, assignment, and the AI agent call interface where teams review every call between an agent and a patient.',
      'We debated swapping in ElevenLabs for the voice layer. We didn\u2019t. What we had worked, and shipping mattered more than swapping infrastructure.',
      'Working with the AI researcher on the call scripts is where I learned about ingestions and stored procedures. That changed every modal I designed after \u2014 if the data underneath is heavy, the interface has to respect that.',
      'This was also the feature where I made my first real commit to the production codebase. My lead walked me through it. I didn\u2019t break anything. He was surprised. So was I.',
    ],
    images: [
      {
        src: 'PLACEHOLDER',
        label: 'Schedule Batch — channel selection',
        hint: 'public/images/schedule-batch.png',
      },
      {
        src: 'PLACEHOLDER',
        label: 'AI Agent Calls — review queue',
        hint: 'public/images/ai-agent-calls.png',
      },
    ],
    decision:
      'Putting channel selection at the start of the flow instead of burying it in settings. It made the rest of the scheduling feel obvious.',
  },
  {
    number: '04',
    title: 'From Figma to the codebase',
    paragraphs: [
      'Figma became a bottleneck. Handoff was getting expensive \u2014 every small inconsistency cost the dev team time, and collaboration on long flows broke down.',
      'I took the leap. HTML, CSS, React basics. The unlock was components and state management \u2014 once I saw them as design layers, everything clicked.',
      'I started living in the IDE more than Figma. Cursor changed how I work. I use ask mode constantly to understand the codebase before I touch it, and I ship features one at a time without breaking the system.',
      'I\u2019m not a senior engineer. I still ask my lead for help on harsh merge conflicts, and I\u2019ve fixed self-inflicted bugs more than once. But I design and build now, and the speed difference is real.',
    ],
    images: [],
    decision:
      'Learning to code in the middle of a job, on a live codebase, instead of waiting for a better time.',
  },
  {
    number: '05',
    title: 'Designing tools I didn\u2019t fully understand at first',
    paragraphs: [
      'Later in the year I was given two of the harder features in the product: the Health Resource Allocation tool and the ROI Simulator.',
      'The first lets care management programs optimize capacity, costs, and investment priorities across roles like Care Managers, Pharmacists, PCPs, and Community Health Workers. It runs bottleneck analysis and surfaces an optimized enrollment list with impact scores and cost estimates.',
      'The second runs Monte Carlo simulations across program outcomes \u2014 net savings, ROI, hospital admissions avoided, capacity needed.',
      'I\u2019m not a healthcare practitioner. I designed both by working closely with the AI researcher and clinical advisors, asking dumb questions until I understood what each number actually meant.',
      'The interface is a translation layer. Take dense, statistical, healthcare-economics output. Make it readable to a care management lead who has to decide in two minutes.',
    ],
    images: [
      {
        src: 'PLACEHOLDER',
        label: 'Health Resource Allocation — optimization view',
        hint: 'public/images/resource-allocation.png',
      },
      {
        src: 'PLACEHOLDER',
        label: 'ROI Simulator — Monte Carlo distribution',
        hint: 'public/images/roi-simulator.png',
      },
    ],
    decision:
      'Showing the Monte Carlo distribution as a chart instead of a table. The math is the same. The trust it builds is completely different.',
  },
  {
    number: '06',
    title: 'Where it is now',
    paragraphs: [
      'The product has paying customers and active pilots. The design system covers admin web, a patient-facing Android app I also designed, and the Member Experience internal customer care assistant. I own the UI system end-to-end and contribute to the production codebase.',
      'If I were rebuilding parts from scratch I\u2019d revisit the empty states across the dashboards \u2014 too many narrate the absence of data instead of pulling users into action. I\u2019d push harder on the voice agent UX too. There\u2019s still a gap between how patients experience an AI call and how care managers review one.',
      'That\u2019s the next chapter. This one was about getting from zero to a working, paid, used product. I did that.',
    ],
    images: [],
    decision: null,
  },
]
