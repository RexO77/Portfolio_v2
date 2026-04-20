import type { LifePageContent } from '@/types/content'

import memory01 from '@/assets/life/memory-01.webp'
import memory02 from '@/assets/life/memory-02.webp'
import memory03 from '@/assets/life/memory-03.webp'
import memory04 from '@/assets/life/memory-04.webp'
import memory05 from '@/assets/life/memory-05.webp'
import memory06 from '@/assets/life/memory-06.webp'
import memory07 from '@/assets/life/memory-07.webp'
import memory08 from '@/assets/life/memory-08.webp'
import memory09 from '@/assets/life/memory-09.webp'

export const lifePageContent: LifePageContent = {
  titleLead: 'beyond',
  titleEmphasis: 'the work.',
  photos: [
    {
      src: memory01,
      alt: 'Memory 1',
      left: '5%',
      top: '10%',
      z: 2,
    },
    {
      src: memory02,
      alt: 'Memory 2',
      left: '64%',
      top: '6%',
      z: 3,
    },
    {
      src: memory03,
      alt: 'Memory 3',
      left: '78%',
      top: '32%',
      z: 2,
    },
    {
      src: memory04,
      alt: 'Memory 4',
      left: '8%',
      top: '42%',
      z: 4,
    },
    {
      src: memory05,
      alt: 'Memory 5',
      left: '44%',
      top: '60%',
      z: 3,
    },
    {
      src: memory06,
      alt: 'Memory 6',
      left: '70%',
      top: '54%',
      z: 2,
    },
    {
      src: memory07,
      alt: 'Memory 7',
      left: '16%',
      top: '58%',
      z: 3,
    },
    {
      src: memory08,
      alt: 'Memory 8',
      left: '36%',
      top: '20%',
      z: 4,
    },
  ],
  essay: {
    eyebrow: 'A personal note',
    titleLines: ['Life, beyond', 'the portfolio'],
    portrait: {
      src: memory09,
      alt: 'Nischal on graduation day, 2025',
      caption: 'Graduation day, 2025',
    },
    paragraphs: [
      'Hey — thanks for being here.',
      "I'm Nischal. I studied Computer Science at Jyothy Institute of Technology. Went in thinking I'd write code for a living. Came out realizing I care more about how software feels than how it runs.",
      "Somewhere between algorithms and data structures, I started noticing the gaps where technically correct software still confused people. I'd watch friends use my class projects and quietly rewrite the parts that tripped them up. That habit never stopped.",
      "My internship at Varcons Technologies humbled me fast. I built a flow I thought was perfect; users broke it in minutes. That's when I stopped trusting assumptions and started trusting the users. At WinWire, working on enterprise tools taught me that clarity isn't decoration. I also took a side project all the way to the Smart India Hackathon finals, which proved what happens when you back up ideas with solid research.",
      "These days, I'm a full-time Product Designer at Talview. I shape our core systems and recently led a complete overhaul of our Admin Login and Authentication flow. Working directly with our CTO on complex challenges like assessment engines has pushed me to ruthlessly strip away UI clutter. My design process is strictly system-oriented now — driven by heuristics, cognitive psychology, and engineering logic rather than just gut feeling.",
      "When I'm not designing, I'm usually obsessing over how things work on a granular level — funneling my deep dives into cognitive neuroscience into my Light Idea Labs blog, or just shitposting on X. Otherwise, you'll find me following the mechanics of Formula One, reading, or bringing my camera along on my travels. Fair warning: if I get excited about a flawless user flow or a genuinely great burrito, you will definitely know about it.",
    ],
    signoff: '— Nischal',
    books: {
      eyebrow: 'On the shelf',
      caption:
        'Books that shaped how I think about design, wealth, and the quiet work of becoming.',
      items: [
        {
          title: 'The Almanack of Naval Ravikant',
          author: 'Eric Jorgenson',
          src: 'https://covers.openlibrary.org/b/isbn/9781544514215-M.jpg',
          largeSrc: 'https://covers.openlibrary.org/b/isbn/9781544514215-L.jpg',
        },
        {
          title: 'The Design of Everyday Things',
          author: 'Don Norman',
          src: 'https://covers.openlibrary.org/b/isbn/9780465050659-M.jpg',
          largeSrc: 'https://covers.openlibrary.org/b/isbn/9780465050659-L.jpg',
        },
        {
          title: 'The Mountain Is You',
          author: 'Brianna Wiest',
          src: 'https://covers.openlibrary.org/b/isbn/9781949759228-M.jpg',
          largeSrc: 'https://covers.openlibrary.org/b/isbn/9781949759228-L.jpg',
        },
      ],
    },
    spotify: {
      eyebrow: 'On repeat',
      caption:
        'What’s playing while I design, write, or stare at the ceiling.',
      items: [
        {
          title: 'Daily Essentials',
          embedUrl:
            'https://open.spotify.com/embed/playlist/3kY9tt2OlSj35xmN6Tulxq?utm_source=generator',
        },
        {
          title: 'Midnight Crash',
          embedUrl:
            'https://open.spotify.com/embed/playlist/6GRRlJpjRd4g48Vgb2j9Y7?utm_source=generator',
        },
      ],
    },
  },
}
