export const campaignWorkflowSlackThread = {
  channel: '# product-design',
  label: 'Thread',
  messages: [
    {
      author: 'Lead Engineer',
      time: '10:14 AM',
      lines: [
        "We're adding SMS next.",
        'AI Voice is after that.',
        'Should we just build separate screens for each?',
      ],
    },
    {
      author: 'You',
      time: '10:16 AM',
      lines: ['Maybe.', 'Can I ask something first?'],
    },
    {
      author: 'Lead Engineer',
      time: '10:16 AM',
      lines: ['Sure.'],
    },
    {
      author: 'You',
      time: '10:18 AM',
      lines: [
        'How does a care manager actually think?',
        'Do they wake up thinking, "I want to send an SMS"?',
        'Or do they think, "I need to reach these members today"?',
      ],
    },
    {
      author: 'Lead Engineer',
      time: '10:19 AM',
      lines: [
        "Probably the second.",
        "They're trying to get a response.",
        'The channel is just how they get there.',
      ],
    },
    {
      author: 'You',
      time: '10:20 AM',
      lines: [
        'Exactly.',
        'So why are we making the channel the center of the workflow?',
      ],
    },
    {
      author: 'Lead Engineer',
      time: '10:21 AM',
      lines: [
        'Because each one behaves differently.',
        'Email has templates.',
        'SMS has limits.',
        'AI Voice needs a call script.',
      ],
    },
    {
      author: 'You',
      time: '10:23 AM',
      lines: [
        "That's true.",
        'But before any of that… they still choose members.',
        'They still create a campaign.',
        'They still schedule it.',
        'They still review it.',
      ],
    },
    {
      author: 'Lead Engineer',
      time: '10:24 AM',
      lines: ["So you're saying the campaign is the real product?"],
    },
    {
      author: 'You',
      time: '10:25 AM',
      lines: [
        'I think so.',
        'Everything before delivery is shared.',
        'Only the delivery changes.',
      ],
    },
    {
      author: 'Lead Engineer',
      time: '10:27 AM',
      lines: [
        'Interesting…',
        'So a care manager builds the campaign once…',
        'then decides whether it goes out by Email, SMS, AI Voice, or all three?',
      ],
    },
    {
      author: 'You',
      time: '10:28 AM',
      lines: [
        'Exactly.',
        'And if we add WhatsApp next year…',
        "we shouldn't redesign the workflow again.",
        'We should just add another delivery option.',
      ],
    },
    {
      author: 'Lead Engineer',
      time: '10:30 AM',
      lines: [
        'That actually makes the whole system easier to scale.',
        'One workflow.',
        'Multiple channels.',
      ],
    },
    {
      author: 'You',
      time: '10:31 AM',
      lines: [
        "That's the goal.",
        "We shouldn't make care teams learn three products.",
        'We should help them communicate with members from one place.',
      ],
    },
  ],
}
