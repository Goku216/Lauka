"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import { Eye, EyeOff, Save, X } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { changeUserPassword } from "@/service/api";

export const editPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current Password cannot be empty"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordFormValues = z.infer<typeof editPasswordSchema>;

export interface ProfileChangePasswordModalProps {
  setShowEditPasswordModal: React.Dispatch<SetStateAction<boolean>>;
}

const ProfileChangePasswordModal = ({
  setShowEditPasswordModal,
}: ProfileChangePasswordModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
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
      setShowEditPasswordModal(false);
      toast.success(response.message || "Password changed successfully!")
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowEditPasswordModal(false)}
      />
      <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-md">
        {/* Modal Header */}
        <div className="border-b border-border p-4 sm:p-6 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Edit Password
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEditPasswordModal(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Current Name */}
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-sm font-medium">
              Current Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="current-password"
                {...register("currentPassword")}
                className="pr-10"
                placeholder="Enter your current password"
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
              <p className="text-sm text-red-500 mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-sm font-medium">
              New Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="new-password"
                {...register("newPassword")}
                className="pr-10"
                placeholder="Enter your new password"
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

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-sm font-medium">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="confirm-password"
                {...register("confirmPassword")}
                className="pr-10"
                placeholder="Confirm password"
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

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowEditPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              type="submit"
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProfileChangePasswordModal;
