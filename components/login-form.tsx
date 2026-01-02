"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { toast } from "sonner"
import { login } from "@/service/api"

type LoginFormProps = React.ComponentProps<"div"> & {
  onSwitch?: () => void;
  onLoginSuccess?: () => void;
};

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm({
  className,
  onSwitch,
  onLoginSuccess,
  ...props
}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(values: LoginFormValues) {
    try {
      console.log('Starting login with:', values)
      const response = await login({ email: values.email, password: values.password })
      
      console.log('Login response:', response)

      if (response?.error) {
        toast.error(response.error)
        return
      }

      if (response?.message) {
        toast.success(response.message)
      }

      // Reset form and close modal on success
      reset()
      onLoginSuccess?.()
    } catch (error) {
      console.error('Login error:', error)
      toast.error("Login failed. Please try again.")
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register('email')}
                />
                {errors.email?.message && (
                  <FieldDescription className="text-destructive">
                    {String(errors.email.message)}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  {...register('password')}
                />
                {errors.password?.message && (
                  <FieldDescription className="text-destructive">
                    {String(errors.password.message)}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={onSwitch}
                    className="underline-offset-4 underline text-sm"
                  >
                    Sign up
                  </button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
