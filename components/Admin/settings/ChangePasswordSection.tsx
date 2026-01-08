"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  editPasswordSchema,
  PasswordFormValues,
} from "@/components/UserProfile/ProfileChangePasswordModal";
import { changeUserPassword } from "@/service/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ChangePasswordSection = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {isSubmitting, errors },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(editPasswordSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      const apiData = {
        old_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword,
      };

      const response = await changeUserPassword(apiData);
      reset();
      toast.success(response.message || "Password changed successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Password</CardTitle>
        </div>
        <CardDescription>Change your password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
            <Input
              id="current-password"
              type={showPassword ? "text" : "password"}
              {...register("currentPassword")}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            </div>
             {errors.currentPassword && (
              <p className="text-sm text-red-500">
                {errors.currentPassword.message}
              </p>
            )}
          </div>
         
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              {...register("newPassword")}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            </div>
             {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
             <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              id="confirm-password"
              {...register("confirmPassword")}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            </div>
             {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button disabled={isSubmitting} type="submit">Update Password</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordSection;
