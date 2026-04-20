import { AuthProvider } from '@/features/auth'
import { AppRouter } from '@/router/AppRouter'

const App = () => (
  <AuthProvider>
    <AppRouter />
  </AuthProvider>
)

export default App