import type { ProjectSummary } from '@/types/content'

export const featuredProjects: ProjectSummary[] = [
  {
    id: 'question-library',
    label: 'Case Study',
    title: 'Question Library',
    description:
      'Replaced a flat question table with a skill-first explorer — cutting duplication, surfacing structure, and laying the foundation for AI-driven assessments.',
    hoverSummary:
      'Skill-first question library — less duplication, clearer structure, AI-ready.',
    role: 'Product Designer',
    timeline: '8 weeks',
    tags: ['Product Design', 'Systems Thinking', 'Enterprise'],
    imageSrc:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&h=1200&fit=crop',
    to: '/projects/question-library',
  },
]
