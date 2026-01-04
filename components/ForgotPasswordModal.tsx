"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { toast } from "sonner";


interface ForgotPasswordModalProps {
    setForgotPassword: (value: boolean) => void;
}

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
})

type ForgotPasswordFormValues = z.infer<typeof emailSchema>


const ForgotPasswordModal = ({setForgotPassword} : ForgotPasswordModalProps) => {
    const [isloading, setIsLoading] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
      } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(emailSchema),
      })
    

    async function onSubmit(values: ForgotPasswordFormValues) {
      try {


        // Clear form first
        reset({
          email: '',
        })
        
  
      } catch (error) {
        toast.error("Registration failed. Please try again.")
      }
    }
  return (
     <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
             
              <CardTitle className="text-xl">Forgot Password?</CardTitle>
              <CardDescription>
                Enter your email address to reset your password <span className="font-semibold text-foreground"></span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                 <Button  variant="default" className="w-full">Reset Password</Button>
              <Button 
                onClick={() => {
                  setForgotPassword(false)
                }}
                variant="outline"
                className="w-full"
              >
                Back to Login
              </Button>
              </Field>
              </FieldGroup>
              </form>
             
            </CardContent>
          </Card>
        </div>
  )
}

export default ForgotPasswordModal