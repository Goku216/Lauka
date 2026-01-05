import Products from "@/components/pages/Products"
import { Suspense } from "react"

const page = () => {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
    <Products />
    </Suspense>
  )
}

export default page