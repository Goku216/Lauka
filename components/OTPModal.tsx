"use client";
import z from "zod";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./ui/input-otp";

interface OTPModalProps {
  setShowOTPModal: (value: boolean) => void;
  setShowEditPasswordModal: (value: boolean) => void;
}

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

type OTPFormValues = z.infer<typeof otpSchema>;

const OTPModal = ({
  setShowOTPModal,
  setShowEditPasswordModal,
}: OTPModalProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(values: OTPFormValues) {
   
    reset();
    setShowOTPModal(false);
    setShowEditPasswordModal(true);
  
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Enter verification code</CardTitle>
          <CardDescription>
            We sent a 6-digit code to your email.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel>Verification code</FieldLabel>

                <div className="flex justify-center">
                  <Controller
                    name="otp"
                    control={control}
                    render={({ field }) => (
                      <InputOTP {...field} maxLength={6} className="gap-2">
                        <InputOTPGroup>
                          <InputOTPSlot index={0} className="otp-slot" />
                          <InputOTPSlot index={1} className="otp-slot" />
                          <InputOTPSlot index={2} className="otp-slot" />
                        </InputOTPGroup>

                        <InputOTPSeparator />

                        <InputOTPGroup>
                          <InputOTPSlot index={3} className="otp-slot" />
                          <InputOTPSlot index={4} className="otp-slot" />
                          <InputOTPSlot index={5} className="otp-slot" />
                        </InputOTPGroup>
                      </InputOTP>
                    )}
                  />
                </div>

                {errors.otp && (
                  <FieldDescription className="text-destructive text-center">
                    {errors.otp.message}
                  </FieldDescription>
                )}
              </Field>

              <Field className="space-y-2">
                <Button type="submit" className="w-full">
                  Verify OTP
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowOTPModal(false)}
                >
                  Back to Login
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPModal;
