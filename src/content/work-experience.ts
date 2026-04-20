import type { WorkExperience } from '@/types/content'

// Freelance entries fill the gaps between full-time / internship roles so
// the dial always has an active accent. Copy is generic on purpose — edit
// per-entry if you want each gap to read distinctly.
const FREELANCE_DESCRIPTION =
  'Worked on independent design and development projects between full-time roles — exploring problem spaces, sharpening craft, and shipping personal experiments.'

const FREELANCE_META = [
  { label: 'TYPE', value: 'SELF-DIRECTED' },
  { label: 'FOCUS', value: 'DESIGN + CODE' },
  { label: 'MODE', value: 'REMOTE' },
] as const

export const workExperiences: WorkExperience[] = [
  {
    id: 'freelance-2023',
    index: '001/008',
    role: 'Independent Projects',
    company: 'Freelance',
    period: "Aug '23 — Sep '23",
    startYear: 2023,
    startMonth: 8,
    endYear: 2023,
    endMonth: 9,
    description: FREELANCE_DESCRIPTION,
    meta: [...FREELANCE_META],
    accent: 'sand',
  },
  {
    id: 'varcons',
    index: '002/008',
    role: 'UX Design Intern',
    company: 'Varcons',
    period: "Oct '23 — Dec '23",
    startYear: 2023,
    startMonth: 10,
    endYear: 2023,
    endMonth: 12,
    description:
      'Explored UI/UX design fundamentals through guided sessions and self-initiated practice. Applied basic design principles through an independent redesign exercise. Gained exposure to real-world design workflows and tools.',
    meta: [
      { label: 'TYPE', value: 'INTERNSHIP' },
      { label: 'DURATION', value: '3 MONTHS' },
      { label: 'LOCATION', value: 'BENGALURU' },
      { label: 'MODE', value: 'HYBRID' },
    ],
    accent: 'green',
  },
  {
    id: 'freelance-2024',
    index: '003/008',
    role: 'Independent Projects',
    company: 'Freelance',
    period: "Jan '24 — Aug '24",
    startYear: 2024,
    startMonth: 1,
    endYear: 2024,
    endMonth: 8,
    description: FREELANCE_DESCRIPTION,
    meta: [...FREELANCE_META],
    accent: 'sand',
  },
  {
    id: 'winwire',
    index: '004/008',
    role: 'Project Intern, UI/UX',
    company: 'WinWire',
    period: "Sep '24 — Dec '24",
    startYear: 2024,
    startMonth: 9,
    endYear: 2024,
    endMonth: 12,
    description:
      'Worked directly with senior designers to create user-centric, visually compelling design solutions for enterprise clients. Contributed to style guides and component-level design across multiple product surfaces.',
    meta: [
      { label: 'TYPE', value: 'INTERNSHIP' },
      { label: 'DURATION', value: '4 MONTHS' },
      { label: 'FOCUS', value: 'ENTERPRISE UX' },
      { label: 'MODE', value: 'ON-SITE' },
    ],
    accent: 'yellow',
  },
  {
    id: 'freelance-2025',
    index: '005/008',
    role: 'Independent Projects',
    company: 'Freelance',
    period: "Jan '25 — May '25",
    startYear: 2025,
    startMonth: 1,
    endYear: 2025,
    endMonth: 5,
    description: FREELANCE_DESCRIPTION,
    meta: [...FREELANCE_META],
    accent: 'sand',
  },
  {
    id: 'curo',
    index: '006/008',
    role: 'Frontend Developer',
    company: 'Curo',
    period: "Jun '25 — Jul '25",
    startYear: 2025,
    startMonth: 6,
    endYear: 2025,
    endMonth: 7,
    description:
      'Led the complete frontend development of the product. Built a fresh new design from scratch in 7 days, squashed major and minor bugs, and built interfaces to scale.',
    meta: [
      { label: 'TYPE', value: 'FREELANCE' },
      { label: 'DURATION', value: '2 MONTHS' },
      { label: 'STACK', value: 'TS, CSS' },
      { label: 'MODE', value: 'REMOTE' },
    ],
    accent: 'purple',
  },
  {
    id: 'talview-intern',
    index: '007/008',
    role: 'Design Intern',
    company: 'Talview',
    period: "Aug '25 — Dec '25",
    startYear: 2025,
    startMonth: 8,
    endYear: 2025,
    endMonth: 12,
    description:
      'Redesigned login and authentication flows to reduce friction and improve entry speed for enterprise users. Re-architected the Skill Taxonomy and Question Library from a legacy structure into a scalable, object-based system.',
    meta: [
      { label: 'TYPE', value: 'INTERNSHIP' },
      { label: 'DURATION', value: '5 MONTHS' },
      { label: 'FOCUS', value: 'PRODUCT DESIGN' },
      { label: 'MODE', value: 'ON-SITE' },
    ],
    accent: 'orange',
  },
  {
    id: 'talview',
    index: '008/008',
    role: 'Product Designer',
    company: 'Talview',
    period: "Jan '26 — PRES",
    startYear: 2026,
    startMonth: 1,
    endYear: 'present',
    description:
      'Delivered production-ready design specs for complex B2B workflows with close alignment between Product and Engineering. Took on greater ownership across the product surface.',
    meta: [
      { label: 'TYPE', value: 'FULL-TIME' },
      { label: 'FOCUS', value: 'B2B PRODUCT' },
      { label: 'LOCATION', value: 'BENGALURU' },
      { label: 'MODE', value: 'ON-SITE' },
    ],
    accent: 'blue',
  },
]
