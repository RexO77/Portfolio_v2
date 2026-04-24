import { featuredProjects } from '@/content/projects'
import { siteMetadata } from '@/content/site'
import type { CaseStudyContent } from '@/types/content'

const summary =
  featuredProjects.find((project) => project.id === 'question-library') ??
  featuredProjects[0]

export const questionLibraryCaseStudy: CaseStudyContent = {
  summary,
  hero: {
    backLabel: 'Back to projects',
    title: 'Building a Question Library That Thinks in Skills',
    subtitle:
      'A new explorer based system that makes skill structure visible, reduces duplication, and prepares the Assessment Engine for AI-driven workflows.',
    meta: [
      { label: 'Role', value: 'Product Designer' },
      { label: 'Timeline', value: '8 weeks' },
      { label: 'Stakeholders', value: 'CTO, Associate PM, Lead PM' },
    ],
    shipped: 'Skill Taxonomy explorer + question context preview',
    image: {
      src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&h=1200&fit=crop',
      alt: 'Skill Taxonomy explorer interface',
      caption: 'Final explorer-based Skill Taxonomy experience',
    },
  },
  context: {
    label: 'Context',
    paragraphs: [
      'Question Library is the operating system for assessments, grading, and report generation.',
      'Talview is a B2B SaaS company in HR tech building an Agentic AI experience across proctoring, interviewing, and candidate evaluation. The Question Library sits inside the Assessment Engine and powers how assessments are created, evaluated, and scaled.',
      'Before AI could reason about skills, humans needed a way to define them clearly and consistently.',
    ],
  },
  problem: {
    label: 'The Problem',
    heading: 'Where reuse failed',
    paragraphs: [
      'SMEs build assessments by deciding which skills matter, then finding or creating questions that reliably test those skills.',
      'The old system stored questions in a large table with tags and filters. Searching for a skill often returned many similar questions with different names, tags, or formats.',
      'So reuse collapsed. People recreated questions instead of reusing them.',
    ],
    bullets: [
      'Similar questions, different tags',
      'No canonical source of truth',
      'Recreating felt safer than reusing',
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&h=800&fit=crop',
      alt: 'Search returned many near-duplicates without context',
      caption:
        'Search returned many near-duplicates without context or ownership',
    },
  },
  whyItMattered: {
    label: 'Why This Mattered',
    intro: 'This was not just a usability issue. It created noise for humans and for AI.',
    stats: [
      {
        prefix: '₹',
        from: 30,
        target: 60,
        suffix: 'L',
        description: 'wasted on duplicate content and cleanup effort',
      },
      {
        from: 4,
        target: 8,
        suffix: ' wks',
        description: 'from concept to shipped solution',
      },
      {
        from: 50,
        target: 100,
        suffix: '+',
        description: 'hours lost to normalization and rework',
      },
    ],
    note: 'Imports arrived in Word, PDF, Excel, and Markdown, each requiring manual standardization.',
  },
  obviousFix: {
    label: 'What the Obvious Fix Missed',
    paragraphs: [
      'My first instinct was to fix the table. Cleaner layout, better filters, less clutter.',
      'It failed because tables flatten relationships. Skills are not rows. Improving the surface did not change how users reasoned or reused content.',
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
      alt: 'V1 improved table layout',
      caption: 'V1 improved the table, but the mental model stayed flat',
    },
  },
  reframe: {
    label: 'The Reframe',
    display: 'The real problem was the mental model.',
    paragraphs: [
      'People already understand how to organize complex systems. They do it daily in tools like Finder and Figma.',
      'Hierarchy is a human pattern we already trust.',
    ],
    bullets: [
      'Skills behave like folders',
      'Questions behave like files',
      'Hierarchy becomes visible',
      'Context stays intact',
      'Reuse becomes natural',
    ],
    rows: [
      { q: 'Q: Define polymorphism', tag: 'OOP' },
      { q: 'Q: Explain inheritance', tag: 'OOP' },
      { q: 'Q: What is polymorphism?', tag: 'Java' },
      { q: 'Q: Describe OOP concepts', tag: 'General', dim: true },
    ],
    panelsCaption: 'From rows and tags to hierarchy and context',
    tree: {
      root: 'Programming',
      branches: [
        {
          name: 'OOP',
          leaves: ['Polymorphism', 'Inheritance'],
        },
        {
          name: 'Functional',
          collapsed: true,
        },
      ],
    },
  },
  system: {
    label: 'The System',
    paragraphs: [
      'The final design introduced a hierarchical skill explorer paired with an instant preview pane. Selecting a skill surfaces its description, related domains, and associated questions in context. Questions stay embedded within the hierarchy to preserve meaning and ownership.',
      'Selecting a skill shows details and linked questions instantly, without modals.',
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=800&fit=crop',
      alt: 'Skill Taxonomy explorer: skill tree on left, preview pane in center, question metadata inline',
      caption: 'Structure does the work, the interface stays quiet',
    },
  },
  ownership: {
    label: 'My Role & Ownership',
    paragraphs: [
      'After the first iteration, leadership explicitly pushed for a fundamentally different approach. From that point, I owned problem reframing, the new mental model, the explorer structure, and iterative exploration.',
      'The Associate PM helped validate direction and filter feedback. Reviews with the CTO and PM were frequent, three to four sessions per week during the intense phase.',
      'Timelines, technical feasibility, and procurement scope were outside design ownership.',
    ],
    successLabel: 'What success looked like',
    successBullets: [
      'Fast reuse decisions',
      'Clear skill structure',
      'Reduced duplication',
    ],
  },
  impact: {
    label: 'Impact',
    display:
      'The new system reduced duplication, improved discoverability, and created a foundation where both humans and AI can reason about skills consistently.',
    paragraphs: [
      'The system became the backbone for how assessments are authored and scaled inside the Assessment Engine.',
    ],
  },
  detailSections: [
    {
      label: 'Iterations & Rejected Directions',
      paragraphs: [
        'The first three iterations centered on improving the existing table: better column ordering, inline skill tags, and contextual filters. Each version tested well in isolation but failed when SMEs had to cross-reference skills across assessments.',
        'A card-based layout was explored next, grouping questions by skill cluster. This surfaced relationships better, but introduced cognitive load when skills spanned multiple domains.',
        'The breakthrough came from observing that users naturally described skills in terms of hierarchy: parent skills, sub-skills, and leaf-level questions. The interface needed to match this mental model, not abstract over it.',
      ],
    },
    {
      label: 'Interaction Details',
      paragraphs: [
        'The explorer uses a persistent sidebar with expandable skill nodes. Clicking a skill opens a context pane showing its description, associated questions, and usage across assessments.',
        'Drag-and-drop was considered for reordering skills but removed after usability testing showed it conflicted with the taxonomy\'s inherent structure. Instead, skills are positioned via a dedicated taxonomy editor available to admins.',
        'Question preview cards show type, difficulty, and last-used date inline, reducing the need to open separate detail views.',
      ],
    },
    {
      label: 'Constraints & Trade-offs',
      paragraphs: [
        'The taxonomy depth was capped at four levels to balance expressiveness with navigability. Deeper hierarchies were supported via tagging, keeping the explorer focused.',
        'Full-text search across questions was deprioritized in favor of skill-first navigation, a deliberate choice to reinforce the mental model shift.',
        'The system was designed to be AI-ready from the start: each skill node carries structured metadata that downstream models can consume for auto-tagging and gap analysis.',
      ],
    },
  ],
  cta: {
    heading: 'Want to see more work?',
    primaryLabel: 'View all projects',
    primaryTo: '/#work',
    secondaryLabel: 'Get in touch',
    secondaryHref: `mailto:${siteMetadata.contactEmail}`,
  },
}
