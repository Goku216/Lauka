import ProductDetail from "@/components/pages/ProductDetails"
import { Suspense } from "react";

const page = async ({params} : {params: Promise<{id: string}>}) => {
  const {id} = await params;
  return (
    <Suspense fallback={<div>Loading products...</div>}>
    <ProductDetail id={id}/>
    </Suspense>
  )
}

export default page