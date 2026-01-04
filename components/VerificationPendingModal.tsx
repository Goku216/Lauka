import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Mail } from "lucide-react";

interface VerificationPendingModalProps {
    verificationEmail: string;
    setIsVerificationPending: (value: boolean) => void;
    reset: () => void;
}


const VerificationPendingModal = ({verificationEmail, setIsVerificationPending, reset} : VerificationPendingModalProps) => {
  return (
       <div className="flex flex-col gap-6">
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
                  go back 
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
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
  )
}

export default VerificationPendingModal