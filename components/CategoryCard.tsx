import { Apple, Carrot, TreeDeciduous, Leaf, Milk, Wheat, LucideIcon } from 'lucide-react';
import { Category } from '@/types';
import Link from 'next/link';

const iconMap: Record<string, LucideIcon> = {
  Apple,
  Carrot,
  TreeDeciduous,
  Leaf,
  Milk,
  Wheat,
};

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Leaf;

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group flex flex-col items-center p-6 bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
        <Icon className="h-8 w-8 text-accent-foreground group-hover:text-primary-foreground transition-colors" />
      </div>
      <h3 className="font-semibold text-foreground text-center mb-1">{category.name}</h3>
      <p className="text-sm text-muted-foreground">{category.productCount} items</p>
    </Link>
  );
}
