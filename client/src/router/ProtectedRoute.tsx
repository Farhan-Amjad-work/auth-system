import { Navigate } from 'react-router-dom'

import { useAuthContext } from '@/features/auth'
import { ROUTES } from '@/constants/routes'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext()
  return user ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />
}