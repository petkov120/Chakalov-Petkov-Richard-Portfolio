export const treatmentpathEvidence = {
  opening: {
    overview:
      'TreatmentPath is practice management software for dental offices, scheduling, treatment planning, recalls, and payments mapped to how a real practice runs, not how a designer imagines it runs.',
    problem:
      'Dental software usually optimizes for the clinician. But the dentist, receptionist, practice manager, and patient each hold a different piece of the workflow. Build for one role and the rest of the office works around your product instead of through it.',
    facts: [
      { label: 'Domain', value: 'Dental operations, practice management, multi-role workflows' },
      { label: 'Scope', value: 'Scheduling, treatment planning, recalls, payments, patient journey' },
      { label: 'Status', value: 'In progress, investigation and IA exploration' },
    ],
    context:
      'Product design investigation across four roles in a single practice. The work focused on where workflows collide, when the ledger, the chair, and the front desk need different truths from the same appointment.',
    roleScope: [
      'Mapped end-to-end practice workflows across clinical and operational roles',
      'Designed IA that treats every role as a first-class user, not an afterthought',
      'Explored treatment planning as sequence, not form stack',
    ],
  },
  cinematic: {
    line: 'Four roles. Four mental models.',
    punch: 'Software that only serves the dentist fails on day one.',
  },
  spreads: [
    {
      id: 'roles',
      layout: 'margin',
      margin: {
        label: 'Roles',
        items: ['Dentist', 'Receptionist', 'Practice manager', 'Patient'],
      },
      body: 'Dental software fails when it only serves the clinician. The full practice needs scheduling, payments, recalls, and treatment planning. It has to map to how the office actually runs.',
      evidence: [
        {
          type: 'diagram',
          figure: '1.1',
          date: 'TBD',
          caption: 'Practice workflow. End to end.',
          aspect: 'video',
        },
      ],
    },
    {
      id: 'statement-ops',
      layout: 'statement',
      body: 'Every form is a workflow decision. Every recall is a business outcome.',
    },
    {
      id: 'workflow',
      layout: 'paired',
      evidence: [
        {
          type: 'wireframe',
          figure: '2.1',
          date: 'TBD',
          caption: 'Treatment map. Planning wireframe.',
          aspect: 'fourThree',
        },
        {
          type: 'wireframe',
          figure: '2.2',
          date: 'TBD',
          caption: 'Recall and nurture. Communication flow.',
          aspect: 'fourThree',
        },
      ],
    },
    {
      id: 'operations',
      layout: 'grid',
      evidence: [
        {
          type: 'diagram',
          figure: '3.1',
          date: 'TBD',
          caption: 'Payment flow. Reception to ledger.',
          aspect: 'square',
        },
        {
          type: 'whiteboard',
          figure: '3.2',
          date: 'TBD',
          caption: 'Patient journey mapping session',
          aspect: 'fourThree',
        },
        {
          type: 'research',
          figure: '3.3',
          date: 'TBD',
          caption: 'Practice manager interview notes',
          aspect: 'fourThree',
        },
      ],
    },
    {
      id: 'transformation',
      layout: 'full',
      body: 'From sticky note workflow to structured software. Every step earned its place in the UI.',
      evidence: [
        {
          type: 'sketch',
          figure: '4.1',
          date: 'TBD',
          caption: 'Sticky note workflow. Discovery session.',
          aspect: 'video',
        },
      ],
    },
    {
      id: 'shipped',
      layout: 'full',
      evidence: [
        {
          type: 'shipped',
          figure: '5.1',
          date: 'TBD',
          caption: 'Patient journey. Shipped UI.',
          aspect: 'video',
        },
      ],
    },
  ],
  decisions: [
    {
      decision: 'Treatment planning as a map, not a form stack.',
      why: 'Dentists think in sequences (prep, procedure, follow-up), not isolated fields on separate screens.',
      tradeoff: 'More upfront design complexity for a calmer planning surface.',
      outcome: 'Clearer treatment paths and fewer dropped steps between chair and ledger.',
    },
    {
      decision: 'Recalls owned by the practice, not bolted onto scheduling.',
      why: 'A recall is a business outcome, not a calendar reminder. It belongs in the operational layer.',
      tradeoff: 'Harder to ship a scheduling-only MVP that looks complete on day one.',
      outcome: 'Recall and nurture workflows stay visible to reception and practice management.',
    },
  ],
  notBuilt: [
    {
      title: 'Dentist-only dashboard',
      reason: 'Reception and practice manager workflows were equally critical to adoption. A clinician-only home would have looked polished and failed in the office.',
      evidence: {
        type: 'killed',
        figure: 'K.1',
        date: 'TBD',
        caption: 'Clinician-only home. Rejected IA.',
        aspect: 'video',
      },
    },
    {
      title: 'Separate payment module',
      reason: 'Payments happen mid-treatment, at the desk, and in the ledger, not in a standalone billing app.',
      evidence: {
        type: 'killed',
        figure: 'K.2',
        date: 'TBD',
        caption: 'Standalone billing. Abandoned concept.',
        aspect: 'fourThree',
      },
    },
  ],
  closingQuote:
    'Every form is a workflow decision. Every recall is a business outcome. Software that forgets either one is just another screen.',
  validation: null,
}
