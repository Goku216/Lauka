import {
  ShoppingBag,
  Package,
  Store,
  Grid,
  LayoutGrid,
  Shirt,
  Tags,
  Sparkles,
  Footprints,
  Activity,
  Laptop,
  Smartphone,
  Tablet,
  Cpu,
  Plug,
  Headphones,
  Home,
  Sofa,
  Lamp,
  Bed,
  Utensils,
  Coffee,
  Apple,
  ShoppingCart,
  Heart,
  Brush,
  Droplet,
  Puzzle,
  Gamepad2,
  Baby,
  Smile,
  Book,
  Library,
  GraduationCap,
  PenTool,
  Dumbbell,
  Trophy,
  Bike,
  Wrench,
  Hammer,
  Settings,
  Joystick,
  Monitor,
  PawPrint,
  Bone,
  Watch,
  Gem,
  Star,
  Crown,
  Cloud,
  Download,
  File,
  Zap,
} from "lucide-react";

export const ICON_MAP = {
  // General
  ShoppingBag,
  Package,
  Store,
  Grid,
  LayoutGrid,

  // Fashion
  Shirt,
  Tags,
  Sparkles,

  // Footwear / Activity
  Footprints,
  Activity,

  // Electronics
  Laptop,
  Smartphone,
  Tablet,
  Cpu,
  Plug,
  Headphones,

  // Home & Living
  Home,
  Sofa,
  Lamp,
  Bed,

  // Food & Grocery
  Utensils,
  Coffee,
  Apple,
  ShoppingCart,

  // Beauty & Care
  Heart,
  Brush,
  Droplet,

  // Kids / Toys
  Puzzle,
  Gamepad2,
  Baby,
  Smile,

  // Books / Education
  Book,
  Library,
  GraduationCap,
  PenTool,

  // Sports
  Dumbbell,
  Trophy,
  Bike,

  // Tools / Hardware
  Wrench,
  Hammer,

  Settings,

  // Gaming
  Joystick,
  Monitor,

  // Pets
  PawPrint,
  Bone,

  // Accessories / Jewelry
  Watch,
  Gem,
  Star,
  Crown,

  // Digital / Services
  Cloud,
  Download,
  File,
  Zap,
};

export type IconName = keyof typeof ICON_MAP;
