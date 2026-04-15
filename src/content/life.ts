import type { LifePageContent } from '@/types/content'

export const lifePageContent: LifePageContent = {
  titleLead: 'all your',
  titleEmphasis: 'memories.',
  hint: 'Drag photos and notes',
  photos: [
    {
      src: 'https://images.unsplash.com/photo-1683746531526-3bca2bc901b8?q=80&w=1820&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Memory 1',
      left: '6%',
      top: '12%',
      z: 2,
    },
    {
      src: 'https://images.unsplash.com/photo-1631561729243-9b3291efceae?q=80&w=1885&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Memory 2',
      left: '58%',
      top: '8%',
      z: 3,
    },
    {
      src: 'https://images.unsplash.com/photo-1635434002329-8ab192fe01e1?q=80&w=2828&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Memory 3',
      left: '38%',
      top: '42%',
      z: 4,
    },
    {
      src: 'https://images.unsplash.com/photo-1719586799413-3f42bb2a132d?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Memory 4',
      left: '72%',
      top: '48%',
      z: 2,
    },
    {
      src: 'https://images.unsplash.com/photo-1720561467986-ca3d408ca30b?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Memory 5',
      left: '12%',
      top: '58%',
      z: 3,
    },
    {
      src: 'https://images.unsplash.com/photo-1724403124996-64115f38cd3f?q=80&w=3082&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Memory 6',
      left: '48%',
      top: '72%',
      z: 2,
    },
  ],
  notes: [
    {
      left: '22%',
      top: '22%',
      z: 5,
      label: 'Now',
      body: 'This is a loose scrapbook of places, light, and everyday moments. Swap the copy and images for your own story.',
    },
    {
      left: '62%',
      top: '28%',
      z: 5,
      label: 'How to read',
      body: 'Drag any photo or note. Stack them, uncover the center title, or arrange a little scene—there is no correct order.',
    },
    {
      left: '18%',
      top: '38%',
      z: 5,
      label: 'Colophon',
      body: 'Replace the Unsplash URLs in LifePage with your own files under src/assets when you are ready.',
    },
  ],
}
