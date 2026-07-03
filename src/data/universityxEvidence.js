export const universityxEvidence = {
  opening: {
    overview:
      'UniversityX is an investigation into AI education products that optimize for comprehension, not just response quality. The work had to serve three audiences at once: students, lecturers, and universities.',
    problem:
      'Most AI education products solve retrieval. They answer quickly, but they rarely detect when understanding has failed. Students can copy a perfect response and still walk away confused.',
    facts: [
      { label: 'Timeline', value: '2021 to 2023 (2+ years of product evolution)' },
      { label: 'AI direction', value: 'Started in 2022, before AI tutoring became mainstream in education products' },
      { label: 'Domain', value: 'AI education, adaptive learning, behavioural design' },
      { label: 'Core value', value: 'Save time, save money, improve understanding' },
      { label: 'Validation', value: 'Wema Bank Hackaholics 5.0 winner (NGN 10,000,000)' },
      { label: 'Adoption', value: 'Used across 3 institutions: Covenant University, LASU, and a polytechnic partner' },
      { label: 'Broader impact', value: 'Contributed to projects with NGN 30M+ in awards' },
    ],
    context:
      'UniversityX began as a focused learning platform, then evolved into AI tutoring work in 2022, before this direction became mainstream in education products. The promise of AI in education has never been access. It is understanding. The core question became: can AI recognize when an answer failed, and adapt until the learner actually gets it?',
  },
  cinematic: {
    line: 'The chatbot gave her the answer.',
    punch:
      "She still didn't understand. That was the turning point: stop designing search boxes and start designing for understanding.",
  },
  spreads: [
    {
      id: 'premise',
      layout: 'margin',
      margin: {
        label: 'The Premise',
        items: [
          'Access to information is solved',
          'Understanding is still unsolved',
          'Answers are not evidence of learning',
        ],
      },
      body:
        "Every new model can explain calculus, chemistry, and programming in seconds. Yet learners still abandon lessons because information is not the same as comprehension. The investigation was not whether AI could answer questions. It was whether AI could detect confusion and adapt.",
    },
    {
      id: 'statement-core-question',
      layout: 'statement',
      body: 'Can AI become a better teacher instead of just another chatbot?',
    },
    {
      id: 'three-audiences',
      layout: 'stage',
      kicker: 'Product scope',
      headline: 'One platform for students, lecturers, and universities',
      body:
        'UniversityX was designed for three audiences at once. For students: better understanding. For lecturers: less repetitive admin work and faster delivery. For universities: clearer visibility, lower operational waste, and better learning outcomes. The product value stayed simple: save time, save money, improve understanding.',
      evidence: [
        {
          type: 'shipped',
          figure: '0.0',
          date: '2024',
          caption: 'AI-generated lesson video in the student flow.',
          src: '/images/universityx/ai-generated-video.webp',
          alt: 'UniversityX AI-generated video lesson interface in the app',
          aspect: 'video',
        },
      ],
    },
    {
      id: 'why-this-mattered',
      layout: 'full',
      body:
        "University students rarely fail because information does not exist. They fail because education is designed for the average learner. Some need another explanation. Others need another example. Some need encouragement before they quit. Our hypothesis: learning should not adapt to the curriculum; the curriculum should adapt to the learner.",
    },
    {
      id: 'problem-evidence-board',
      layout: 'board',
      kicker: 'Problem board',
      headline: 'What we were seeing on the ground',
      body:
        'These notes and early screens capture the three tensions we had to solve: weak comprehension signals, low motivation visibility, and high lecturer admin overhead.',
      notes: [
        'Old UI covered basics, but did not clearly support the three-audience model.',
        'Department and home dashboards existed, but insight depth and workflow speed were limited.',
        'We redesigned toward one system: better understanding, lower admin effort, clearer institutional visibility.',
      ],
      evidence: [
        {
          type: 'wireframe',
          figure: '0.1',
          date: '2023',
          caption: 'Old UI baseline. Home dashboard from the early platform phase.',
          src: '/images/universityx/old-institution-dashboard.webp',
          alt: 'UniversityX old home dashboard UI',
          aspect: 'fourThree',
        },
        {
          type: 'wireframe',
          figure: '0.2',
          date: '2023',
          caption: 'Old UI baseline. Department management view before the new system.',
          src: '/images/universityx/new-programs-management.webp',
          alt: 'UniversityX old department management style UI',
          aspect: 'fourThree',
        },
        {
          type: 'shipped',
          figure: '0.3',
          date: '2024',
          caption: 'New UI. Analytics dashboard giving institutions and lecturers clearer visibility.',
          src: '/images/universityx/new-analytics-dashboard.webp',
          alt: 'UniversityX new analytics dashboard UI',
          aspect: 'fourThree',
        },
        {
          type: 'shipped',
          figure: '0.4',
          date: '2024',
          caption: 'New UI. Course creation tools that reduce lecturer setup time.',
          src: '/images/universityx/new-course-setup.webp',
          alt: 'UniversityX new course creation and setup interface',
          aspect: 'fourThree',
        },
      ],
    },
    {
      id: 'what-made-us-different',
      layout: 'margin',
      margin: {
        label: 'What made us different',
        items: [
          'Comprehension over response speed',
          'Guided tutoring over generic chat',
          'Behavioral design over decorative gamification',
          'Student + lecturer + institution ecosystem',
        ],
      },
      body:
        "Most EdTech products optimize for content delivery. UniversityX optimized for understanding. Our AI direction started in 2022 before this approach became mainstream, so the product evolution came from a learning problem we observed, not trend-chasing. The product was designed to recover learning when students were stuck, make progress visible, and support educators operationally. This positioning helped us showcase a different category of AI learning product and contributed to measurable validation in both awards and institutional adoption.",
    },
    {
      id: 'validation',
      layout: 'stage',
      kicker: 'Validation',
      headline: 'Hackaholics 5.0 recognition',
      body:
        'After more than two years of product design, prototyping, and iteration, UniversityX was presented at Wema Bank Hackaholics 5.0 and awarded a NGN 10,000,000 innovation prize. I am on the left in yellow in this photo.',
      evidence: [
        {
          type: 'shipped',
          figure: '1.0',
          date: '2024',
          caption: 'Wema Bank Hackaholics 5.0 award moment (I am on the left in yellow).',
          src: '/images/hackathon.webp',
          alt: 'UniversityX team presentation and award at Wema Bank Hackaholics 5.0',
          aspect: 'slide',
          speechBubble: {
            text: 'Omo, we win, we win this money, o.',
            x: 7,
            y: 9,
          },
        },
      ],
    },
    {
      id: 'finding-01',
      layout: 'full',
      body:
        "Finding 01: The chatbot always answered, but the student still did not learn. Traditional educational chatbots optimize for response speed. Through interviews and prototype testing, we saw students copy responses without building confidence in the concept. Knowledge wasn't accumulating; it was being borrowed.",
    },
    {
      id: 'investigation-01',
      layout: 'stage',
      kicker: 'Investigation 01',
      headline: 'From chatbot to learning companion',
      body:
        'Instead of designing another chatbot, we designed a learning companion. The system adjusted explanations based on learner behavior, recommended alternatives when confidence dropped, and combined conversation with structured lessons. Objective shift: giving answers -> building understanding.',
      evidence: [
        {
          type: 'wireframe',
          figure: '2.0',
          date: '2023',
          caption: 'Old concept. Learning map interface before tutor flow refinement.',
          src: '/images/universityx/old-learning-map.webp',
          alt: 'Older UniversityX learning map concept screen',
          aspect: 'fourThree',
        },
        {
          type: 'shipped',
          figure: '2.1',
          date: '2024',
          caption: 'New design. AI tutor conversation with adaptive re-explanation.',
          src: '/images/universityx/new-ai-tutor-interface.webp',
          alt: 'UniversityX AI tutor interface showing adaptive chat support',
          aspect: 'fourThree',
        },
      ],
    },
    {
      id: 'finding-02',
      layout: 'full',
      body:
        "Finding 02: Motivation disappears when progress is invisible. Students do not always stop because learning is difficult. They stop because improvement feels impossible. Completed lessons looked identical. Nothing celebrated consistency, and nothing rewarded curiosity.",
    },
    {
      id: 'investigation-02',
      layout: 'stage',
      kicker: 'Investigation 02',
      headline: 'Behavioural design, not decoration',
      body:
        "Gamification was treated as behavioural design, not visual garnish. XP, streaks, achievements, and lesson feedback were designed to make invisible progress visible and sustain momentum.",
      evidence: [
        {
          type: 'shipped',
          figure: '3.1',
          date: '2024',
          caption: 'Quiz interaction with immediate correctness and XP feedback.',
          src: '/images/universityx/new-quiz-interaction.webp',
          alt: 'UniversityX quiz interface with XP and continue feedback',
          aspect: 'fourThree',
        },
        {
          type: 'shipped',
          figure: '3.2',
          date: '2024',
          caption: 'Lesson completion state with streak, time, and accuracy visibility.',
          src: '/images/universityx/new-lesson-completion.webp',
          alt: 'UniversityX lesson completion screen showing streak time and accuracy',
          aspect: 'fourThree',
        },
      ],
    },
    {
      id: 'finding-03',
      layout: 'full',
      body:
        'Finding 03: Teachers were overwhelmed by administration, not teaching. Time spent organizing courses, reviewing repetitive work, and tracking attendance reduced time available for instruction. The bottleneck was operational overhead.',
    },
    {
      id: 'investigation-03',
      layout: 'margin',
      margin: {
        label: 'Investigation 03',
        items: [
          'Automation as assistant, not replacement',
          'Unified lecturer dashboard',
          'Operational load shifted off teaching time',
        ],
      },
      body:
        'Automation became an assistant instead of a replacement. Course management, analytics, and repetitive workflows were consolidated into one lecturer dashboard so educators could spend more time teaching and less time navigating tools.',
      evidence: [
        {
          type: 'wireframe',
          figure: '4.0',
          date: '2023',
          caption: 'Old admin baseline. Institution dashboard before operational depth.',
          src: '/images/universityx/old-institution-dashboard.webp',
          alt: 'Older UniversityX institution dashboard concept',
          aspect: 'fourThree',
        },
        {
          type: 'shipped',
          figure: '4.1',
          date: '2024',
          caption: 'New design. Lecturer analytics and progress visibility dashboard.',
          src: '/images/universityx/new-analytics-dashboard.webp',
          alt: 'UniversityX analytics dashboard for lecturer operations and student progress',
          aspect: 'fourThree',
        },
        {
          type: 'shipped',
          figure: '4.2',
          date: '2024',
          caption: 'Course setup workflow to reduce lecturer administrative overhead.',
          src: '/images/universityx/new-course-setup.webp',
          alt: 'UniversityX course setup interface for lecturers',
          aspect: 'fourThree',
        },
        {
          type: 'shipped',
          figure: '4.3',
          date: '2024',
          caption: 'Programs management view for academic structure operations.',
          src: '/images/universityx/new-programs-management.webp',
          alt: 'UniversityX programs management interface with faculties and departments',
          aspect: 'fourThree',
        },
      ],
    },
    {
      id: 'impact',
      layout: 'full',
      body:
        'Impact: UniversityX was recognized for advancing educational engagement through AI-driven personalization and behavioural design. The project won NGN 10,000,000 at Wema Bank Hackaholics 5.0, was used across three institutions (including Covenant University, LASU, and a polytechnic partner), and reinforced a core belief: AI is most valuable when it augments human learning, not when it replaces it.',
    },
  ],
  decisions: [
    {
      decision: 'Design for comprehension signals, not answer velocity.',
      why: 'Answer quality alone was a weak proxy for learning. We needed to see whether understanding actually happened.',
      tradeoff:
        'This required more structured flows and adaptation logic, not just an open-ended chat interface.',
      outcome:
        'The product moved from retrieval behavior toward guided learning behavior and stronger concept retention.',
    },
    {
      decision: 'Treat gamification as behavioural infrastructure.',
      why: 'Motivation decayed when progress was invisible. Learners needed proof of momentum.',
      tradeoff:
        'The team invested in progression mechanics and feedback loops instead of shipping a minimal static lesson UI.',
      outcome: 'Students had visible progress markers, clearer goals, and stronger consistency over time.',
    },
    {
      decision: 'Build operational tooling for lecturers, not just student interfaces.',
      why: 'Teacher time was constrained by repetitive administrative work.',
      tradeoff:
        'Product scope expanded beyond learner experience into educator operations and analytics.',
      outcome:
        'Administrative burden decreased, making room for more direct teaching and mentorship.',
    },
  ],
  notBuilt: [
    {
      title: 'Generic answer-first chatbot direction',
      reason:
        'The direction was deprioritized once research showed that fast answers often masked shallow understanding.',
    },
    {
      title: 'Gamification as cosmetic feature',
      reason:
        'Visual badges without behavioural scaffolding did not address motivation decay or lesson completion patterns.',
    },
  ],
  results: {
    label: 'Outcomes',
    items: [
      { value: 'NGN 10M', detail: 'Awarded at Wema Bank Hackaholics 5.0' },
      { value: '2+ years', detail: 'Design, prototyping, and product evolution cycle' },
      { value: '3 institutions', detail: 'Used by Covenant University, LASU, and a polytechnic partner' },
      { value: '3 core findings', detail: 'Comprehension, motivation, and lecturer operations' },
      { value: 'NGN 30M+', detail: 'Total awards across innovation projects contributed to' },
    ],
  },
  validation:
    'Validation · Wema Bank Hackaholics 5.0 winner (NGN 10,000,000) · used across 3 institutions · NGN 30,000,000+ cumulative innovation awards across projects',
  closingFigure: {
    src: '/images/universityx/uniangel.png',
    alt: 'Classical angel figure used as closing visual for UniversityX',
  },
  authorNoteButtonLabel: 'A note from UniversityX',
  authorNote: {
    kicker: 'A note from UniversityX',
    greeting: 'Hey there,',
    paragraphs: [
      'If you made it to this note, thank you. I hope this page gave you a little spark of joy.',
      'Wherever you are reading from, I am wishing you clarity, good energy, and people who genuinely support your growth.',
      'And if this work made you smile even once, that already means a lot to me.',
    ],
    signOff: 'Petkov',
    email: 'petkovrichard8@gmail.com',
    meta: 'With gratitude from Lagos',
  },
  closingQuote:
    'Before UniversityX, I thought great AI products generated better answers. After UniversityX, I learned the better question is: did the learner actually understand?',
}
