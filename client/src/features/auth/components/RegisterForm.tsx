import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/features/auth";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "At least 8 characters").max(100),
});
type FormValues = z.infer<typeof schema>;

export const RegisterForm = () => {
  const { register: registerUser, isLoading, error } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(registerUser)} className="flex flex-col gap-4">
      {error && (
        <div className="rounded bg-danger-50 px-3 py-2 text-sm text-danger-700">
          {error}
        </div>
      )}
      <Input
        label="Name"
        type="text"
        placeholder="Your name"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••••"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" isLoading={isLoading}>
        Create account
      </Button>
      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to={ROUTES.LOGIN} className="text-brand-600 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
};
