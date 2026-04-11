export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: string;
  tags: string[];
  isLimitedEdition: boolean;
  sizes: string[];
  colors: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  size: string;
  color: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface AdminUser {
  username: string;
  isAuthenticated: boolean;
  lastLogin: string;
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type CategoryFormData = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

export const COLORS = [
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Pure Black', hex: '#000000' },
];

export const CATEGORIES = [
  'Clothing',
  'Accessories',
  'Footwear',
  'Innerwear & Essentials',
  'Premium Line',
];