"use client"
import { useEffect, useState } from "react"
import { CategoryCard } from "../CategoryCard"
import { CategoryResponse } from "@/service/productApi"
import { getCategories } from "@/service/categoryApi"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"


const CategoriesSection = () => {
    const [categories, setCategories] = useState<CategoryResponse[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchCategories()
        
    }, [])
    const fetchCategories = async () => {
    setLoading(true);
    try {
      const {categories} = await getCategories();
      
      setCategories(categories);
      
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };
  return (
  <>
    {loading ? (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories?.map((category) => (
          <CategoryCard
            key={category.reference_id}
            category={category}
          />
        ))}
      </div>
    )}
  </>
);

  
}

export default CategoriesSection