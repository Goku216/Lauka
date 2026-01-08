"use client";
import z, { email } from "zod";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { toast } from "sonner";
import { resendOTP, verifyOTP } from "@/service/api";

interface OTPModalProps {
  setShowOTPModal: (value: boolean) => void;
  setShowEditPasswordModal: (value: boolean) => void;
  email: string;
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
  email
}: OTPModalProps) => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleResend = async () => {
    try {
      const response = await resendOTP(email)
      toast.success(response.message)
    } catch(error: any) {
      toast.error(error.message)
    }

  }

  async function onSubmit(values: OTPFormValues) {
    try {
      const apiData = {
        email: email,
        otp: values.otp
      }
      const response = await verifyOTP(apiData);
      toast.success(response.message || "OTP Verified Successfully!")
    reset();
    setShowOTPModal(false);
    setShowEditPasswordModal(true);
    }
    catch(error: any) {
      toast.error(error.message)
    }
  
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
              <div className="flex gap-2 text-sm font-medium items-center">
                <p>Didn't get the code?</p>
                <button type="button" onClick={handleResend}>
                <p className="text-primary/80 hover:text-primary/50 hover:underline cursor-pointer">Resend Verification</p>
                </button>
              </div>

              <Field className="space-y-2">
                <Button disabled={isSubmitting} type="submit" className="w-full">
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
