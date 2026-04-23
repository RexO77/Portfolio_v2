import { Footer } from '@/components/Footer'
import { ComponentsShowcase } from '@/components/labs/ComponentsShowcase'
import { Navbar } from '@/components/Navbar'
import { useStartupRouteReady } from '@/features/intro/useStartupRouteReady'
import '@/styles/labs-page.css'

export default function LabsPage() {
  useStartupRouteReady()

  return (
    <>
      <Navbar />

      <main id="main-content" tabIndex={-1} className="labs-page">
        <div className="labs-page__shell">
          <h1 className="sr-only">Labs</h1>
          <div className="labs-page__stack">
            <ComponentsShowcase />
          </div>
        </div>

        <div className="labs-page__footer">
          <Footer />
        </div>
      </main>
    </>
  )
}
