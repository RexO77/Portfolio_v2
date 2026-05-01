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
    title: 'Question Library: From Table Chaos to a Skills-First Assessment System',
    subtitle:
      'Helping SMEs find, trust, reuse, and create assessment questions by moving the Question Library from a flat table to a skills-first explorer.',
    meta: [
      { label: 'Role', value: 'Product Designer' },
      { label: 'Timeline', value: '8 weeks' },
      { label: 'Stakeholders', value: 'CTO, Associate PM, Lead PM' },
    ],
    shipped: 'Skill Taxonomy explorer + question context preview',
    image: {
      src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&h=1200&fit=crop',
      alt: 'Skill Taxonomy explorer interface',
      caption:
        'Skills become visible. Questions become easier to trust, compare, and reuse.',
    },
  },
  context: {
    label: 'What this project was',
    paragraphs: [
      'Talview’s Assessment Engine powers assessment creation, grading, and reporting. The Question Library is where skills, questions, metadata, and assessment content come together.',
      'As Talview moved toward Agentic AI, the library needed to do more than store questions. It had to make skill-question relationships clear enough for both humans and AI to trust.',
      'Before AI could understand skills, humans had to define them clearly.',
    ],
  },
  problem: {
    label: 'Current state',
    heading: 'A table that stored content, but did not create trust',
    paragraphs: [
      'Questions lived in a large table with tags and filters. This worked for storage, but not for decision-making.',
      'When SMEs searched for a skill, they often found similar questions with different names, tags, or formats. There was no clear way to know which question was canonical, which skill it truly measured, or whether it was already being used elsewhere.',
      'So people recreated questions instead of reusing uncertain ones.',
    ],
    bullets: [
      'A machine learning question could appear under machine learning, data science, and algorithms.',
      'Similar questions appeared under different names and tags.',
      'The table stored content, but it did not create trust.',
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&h=800&fit=crop',
      alt: 'Old search results showing duplicate questions',
      caption:
        'Similar questions appeared under different names and tags. The table stored content, but it did not create trust.',
    },
  },
  whyItMattered: {
    label: 'Why This Mattered',
    intro:
      'This was not only a usability issue. It created operational waste and weaker data for AI.',
    stats: [
      {
        prefix: '₹',
        from: 0,
        target: 60,
        suffix: 'L',
        description: 'lower-bound duplicated procurement and cleanup cost',
      },
      {
        from: 0,
        target: 4,
        suffix: 'x/wk',
        description: 'CTO and PM reviews during the most intense phase',
      },
      {
        from: 4,
        target: 8,
        suffix: ' wks',
        description: 'to move from structural exploration to shipped direction',
      },
    ],
    note:
      'Question content came from multiple third-party providers in Word, PDF, Excel, and Markdown. During cleanup, duplicate and near-duplicate questions became visible across providers and tags.',
  },
  obviousFix: {
    label: 'What did not work',
    paragraphs: [
      'My first instinct was to improve the table: cleaner layout, better filters, stronger column hierarchy, less noise.',
      'It looked better, but it kept the same problem. Users still had to compare metadata instead of understanding relationships.',
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
      alt: 'V1 improved table layout',
      caption: 'V1 improved the surface, but the mental model stayed flat.',
    },
  },
  reframe: {
    label: 'What changed',
    display: 'Skills behave like folders. Questions behave like files.',
    paragraphs: [
      'This gave SMEs a familiar way to browse, understand, and reuse content. Instead of searching through rows and tags, they could move through a hierarchy and see questions in context.',
      'Tables are useful for storage. Skills need hierarchy, context, and dependencies.',
    ],
    bullets: [
      'Hierarchy over filters',
      'Preview over navigation',
      'Reuse as trust',
      'Familiarity over novelty',
    ],
    rows: [
      { q: 'Q: Train/test split basics', tag: 'ML' },
      { q: 'Q: Model overfitting', tag: 'Data Science' },
      { q: 'Q: Classification metrics', tag: 'Algorithms' },
      { q: 'Q: Supervised learning', tag: 'General', dim: true },
    ],
    panelsCaption: 'From rows and tags to hierarchy and context',
    tree: {
      root: 'Assessment Skills',
      branches: [
        {
          name: 'Machine Learning',
          leaves: ['Classification', 'Model Evaluation'],
        },
        {
          name: 'Data Science',
          collapsed: true,
        },
      ],
    },
  },
  system: {
    label: 'What we built',
    paragraphs: [
      'The final design introduced a Skill Taxonomy explorer with an instant preview pane. The left side shows domains, skills, and subskills. The preview area explains what a selected skill means and which questions belong to it.',
      'Selecting a skill surfaces related questions instantly, without modals or page jumps.',
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=800&fit=crop',
      alt: 'Skill Taxonomy explorer: skill tree on left, preview pane in center, question metadata inline',
      caption:
        'Skill hierarchy, preview context, and linked questions stay visible in one workspace.',
    },
  },
  ownership: {
    label: 'My role',
    paragraphs: [
      'I joined as a product design intern and later owned the core UX direction for the Skill Taxonomy experience.',
      'I owned problem reframing, UX architecture, the explorer interaction model, design iterations, and stakeholder alignment.',
      'The PM helped validate direction and filter feedback. During the most intense phase, reviews with the CTO and PM happened three to four times per week.',
    ],
    successLabel: 'What success looked like',
    successBullets: [
      'SMEs could understand what skill a question measured.',
      'Questions could be evaluated without losing context.',
      'Reuse felt safer than recreating uncertain content.',
    ],
  },
  impact: {
    label: 'What happened',
    display:
      'The Question Library moved from passive storage toward an active assessment workspace.',
    paragraphs: [
      'This was a foundational product direction shift during a larger Assessment Engine refactor.',
      'The redesigned Question Library made skill hierarchy visible, made existing content easier to trust, and gave the product a stronger base for AI-driven workflows.',
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop',
      alt: 'Final Skill Taxonomy explorer motion demo',
      caption:
        'Explore a skill, review linked questions, and act without losing context.',
    },
  },
  detailSections: [
    {
      label: 'What was broken',
      paragraphs: [
        'The old interface started with inventory: rows, tags, filters, and metadata.',
        'But SMEs started with intent: “I need to evaluate this role.”',
        'They needed to know what skill a question measured, whether it was the best version to reuse, and how it related to the assessment they were building.',
        'The old system optimized for storage. Users needed sense-making.',
      ],
    },
    {
      label: 'Before vs after',
      paragraphs: [
        'Before: questions were stored as rows with inconsistent tags. Users had to search, filter, compare, and guess.',
        'After: questions lived inside skill context with preview, ownership, and reuse signals. Users could explore a skill, understand what existed, and decide without leaving the workspace.',
        'Example flow: An SME creating an SDE assessment can move from Programming to Data Structures to Arrays, review linked questions, compare difficulty, and reuse the right item inside the explorer.',
      ],
    },
    {
      label: 'Key product decisions',
      paragraphs: [
        'Hierarchy over filters. Filters assume users know what to search for. Hierarchy helps users understand the domain before they act.',
        'Preview over navigation. The preview pane gives enough context to evaluate a question without opening new pages.',
        'Reuse as trust. Reuse is not solved with a button. Users reuse content only when they trust what they see.',
        'Familiarity over novelty. I avoided custom graph views and dashboard-first layouts. They looked more impressive, but increased learning cost.',
      ],
    },
    {
      label: 'How I judged quality',
      paragraphs: [
        'Density balance: enough information to decide, not enough to overwhelm.',
        'Clarity over completeness: anything that did not support finding, evaluating, creating, or reusing questions was removed or deferred.',
        'Mental model integrity: if an interaction pushed users back into spreadsheet thinking, it did not belong.',
      ],
      image: {
        src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=800&fit=crop',
        alt: 'Density comparison for the Question Library layout',
        caption:
          'The final layout sits between too much information and not enough context.',
      },
    },
    {
      label: 'Constraints',
      paragraphs: [
        'The Assessment Engine was mid-refactor, so the design had to work with existing systems instead of assuming a clean rebuild.',
        'The timeline was aggressive. The work took eight weeks because the problem needed structural exploration, not just UI execution.',
        'The system also had to support future AI workflows, so skills, relationships, and duplicates had to become easier to identify.',
      ],
    },
    {
      label: 'What I learned',
      paragraphs: [
        'I started by trying to improve screens. I ended by redesigning the mental model behind the screens.',
        'Complex products do not become simple by hiding complexity. They become simple when the structure helps users make confident decisions.',
        'Reuse, governance, and AI readiness are all connected by trust. If users cannot trust the structure, they recreate work. If the system cannot trust the structure, AI reasons poorly.',
      ],
    },
    {
      label: 'Credits',
      paragraphs: [
        'Product design: Nischal Skanda.',
        'Stakeholders: CTO, Associate PM, Lead PM.',
        'My contribution: problem reframing, UX architecture, explorer interaction model, design iterations, and stakeholder alignment.',
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
