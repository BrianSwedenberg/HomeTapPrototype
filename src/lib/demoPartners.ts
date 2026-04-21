export const DEMO_PARTNERS = {
  contractor: {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Marcus Webb',
    type: 'Contractor',
    company: 'Webb & Sons Home Improvement',
    initials: 'MW',
    avatarColor: 'purple' as const,
  },
  realEstateAgent: {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Sarah Okonkwo',
    type: 'Financial Advisor',
    company: 'Okonkwo Investment Realty',
    initials: 'SO',
    avatarColor: 'teal' as const,
  },
} as const;

export type DemoPartnerKey = keyof typeof DEMO_PARTNERS;
