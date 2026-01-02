
  "use client"

  import { useState } from "react"
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
import { registerUser } from "@/service/api"
import { toast } from "sonner"
import { Mail } from "lucide-react"

  type SignupFormProps = React.ComponentProps<"div"> & {
    onSwitch?: () => void;
  };

  const signupSchema = z
    .object({
      name: z.string().min(3, "Username must be at least 3 characters"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string().min(8, "Confirm password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    })

  type SignupFormValues = z.infer<typeof signupSchema>

  export function SignupForm({
    className,
    onSwitch,
    ...props
  }: SignupFormProps) {
    const [isVerificationPending, setIsVerificationPending] = useState(false)
    const [verificationEmail, setVerificationEmail] = useState("")

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      reset,
    } = useForm<SignupFormValues>({
      resolver: zodResolver(signupSchema),
    })

    async function onSubmit(values: SignupFormValues) {
      try {

        const response = await registerUser({username: values.name, email: values.email, password: values.password});
        
        if(response?.error){
          toast.error(response.error);
          return
        } 
        
        if(response?.message){
          toast.success(response.message);
        }
        
        // Clear form first
        reset({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        })
        
        // Set verification state and email after reset
        setVerificationEmail(values.email)
        setIsVerificationPending(true)
      } catch (error) {
        toast.error("Registration failed. Please try again.")
      }
    }

    if (isVerificationPending) {
      return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl">Verify your email</CardTitle>
              <CardDescription>
                A verification link has been sent to <span className="font-semibold text-foreground">{verificationEmail}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Please click the link in the email to verify your account and complete your registration.
              </p>
              <p className="text-xs text-muted-foreground text-center">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  type="button"
                  onClick={() => setIsVerificationPending(false)}
                  className="text-primary underline hover:text-primary/80"
                >
                  go back to sign up
                </button>
              </p>
              <Button 
                onClick={() => {
                  setIsVerificationPending(false)
                  reset()
                }}
                variant="outline"
                className="w-full"
              >
                Back to Sign Up
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create your account</CardTitle>
            <CardDescription>
              Enter your email below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Username</FieldLabel>
                  <Input placeholder="username" id="name" {...register('name')} />
                  {errors.name?.message && (
                    <FieldDescription className="text-destructive">
                      {String(errors.name.message)}
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input placeholder="abc@example.com" id="email" type="email" {...register('email')} />
                  {errors.email?.message && (
                    <FieldDescription className="text-destructive">
                      {String(errors.email.message)}
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <Field className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Input placeholder="****" id="password" type="password" {...register('password')} />
                      {errors.password?.message && (
                        <FieldDescription className="text-destructive">
                          {String(errors.password.message)}
                        </FieldDescription>
                      )}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                      <Input placeholder="****" id="confirm-password" type="password" {...register('confirmPassword')} />
                      {errors.confirmPassword?.message && (
                        <FieldDescription className="text-destructive">
                          {String(errors.confirmPassword.message)}
                        </FieldDescription>
                      )}
                    </Field>
                  </Field>
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                </Field>
                <Field>
                  <Button type="submit" disabled={isSubmitting}>
                    Create Account
                  </Button>
                  <FieldDescription className="text-center">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={onSwitch}
                      className="underline-offset-4 underline text-sm"
                    >
                      Sign in
                    </button>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
        <FieldDescription className="px-6 text-center">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
          and <a href="#">Privacy Policy</a>.
        </FieldDescription>
      </div>
    )
  }
