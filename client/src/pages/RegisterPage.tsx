import { AuthLayout } from '@/components/layout/AuthLayout'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

const RegisterPage = () => (
  <AuthLayout title="Create an account" subtitle="Start your journey today">
    <RegisterForm />
  </AuthLayout>
)
export default RegisterPage
