import { Outlet } from 'react-router-dom'

export function RootLayout() {
  return (
    <div className="scroll-root">
      <Outlet />
    </div>
  )
}
