import VerifyEmail from "@/components/pages/VerifyEmail"
import { Suspense } from "react"

const page = () => {
  return (
    <Suspense fallback={<div>Loading ...</div>}>
    <VerifyEmail />
    </Suspense>
  )
}

export default page