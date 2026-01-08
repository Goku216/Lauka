import {  Leaf  } from 'lucide-react';
import Link from 'next/link';
import { ICON_MAP } from '@/extras/icon-map';
import { CategoryResponse } from '@/service/productApi';


interface CategoryCardProps {
  category: CategoryResponse;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = ICON_MAP[category.icon] || Leaf;

  return (
    <Link
      href={`/products?category=${category.reference_id}`}
      className="group flex flex-col items-center p-6 bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
        <Icon className="h-8 w-8 text-accent-foreground group-hover:text-primary-foreground transition-colors" />
      </div>
      <h3 className="font-semibold text-foreground text-center mb-1">{category.name}</h3>
      <p className="text-sm text-muted-foreground">{category.product_count} items</p>
    </Link>
  );
}
