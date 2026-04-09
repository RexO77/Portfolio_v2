import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RootLayout } from '@/app/layouts/RootLayout'

const HomePage = lazy(() => import('@/app/pages/HomePage'))
const LifePage = lazy(() => import('@/app/pages/LifePage'))
const QuestionLibraryCaseStudy = lazy(
  () => import('@/app/pages/QuestionLibraryCaseStudy'),
)

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: (
          <Suspense>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: '/life',
        element: (
          <Suspense>
            <LifePage />
          </Suspense>
        ),
      },
      {
        path: '/projects/question-library',
        element: (
          <Suspense>
            <QuestionLibraryCaseStudy />
          </Suspense>
        ),
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
