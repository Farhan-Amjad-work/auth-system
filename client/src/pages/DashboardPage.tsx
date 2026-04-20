import { useAuthContext, useAuth } from '@/features/auth'
import { Button } from '@/components/ui/Button'

const DashboardPage = () => {
  const { user } = useAuthContext()
  const { logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Hello, {user?.name ?? user?.email} 👋</h1>
      <p className="text-sm text-slate-500">{user?.email}</p>
      <Button variant="ghost" className="w-auto" onClick={logout}>Log out</Button>
    </div>
  )
}

export default DashboardPage
