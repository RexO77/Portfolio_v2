'use client'

import { useMemo, useRef } from 'react'
import DynamicScrollIslandTOC, { type DynamicScrollIslandSection } from '.'

const sectionNames = ['Overview', 'Research', 'Problem', 'System', 'Outcome']

export default function DynamicScrollIslandTocDemo() {
  const containerRef = useRef<HTMLDivElement>(null)

  const sections = useMemo<DynamicScrollIslandSection[]>(
    () =>
      sectionNames.map((name) => ({
        id: `dynamic-scroll-island-demo-${name.toLowerCase()}`,
        name,
      })),
    [],
  )

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-d-border/60 bg-d-sheet p-4 text-d-fg shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
      <div ref={containerRef} className="h-[32rem] overflow-y-auto px-2 pb-24 pt-2">
        {sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className="min-h-[24rem] scroll-mt-24 border-b border-d-border/60 py-8 last:border-b-0"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-d-fg/50">
              Section {index + 1}
            </p>
            <h3 className="mt-3 text-3xl font-semibold">{section.name}</h3>
            <p className="mt-4 max-w-2xl text-base leading-7 text-d-fg/72">
              This demo shows the scroll island tracking a local container. The
              active section changes as you move through the content, and the badge
              updates with overall reading progress.
            </p>
          </section>
        ))}
      </div>

      <DynamicScrollIslandTOC sections={sections} containerRef={containerRef} />
    </div>
  )
}
