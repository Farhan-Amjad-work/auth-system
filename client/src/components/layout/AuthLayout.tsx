interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <div className="w-full max-w-sm rounded-xl bg-surface p-8 shadow-card">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  </div>
);
