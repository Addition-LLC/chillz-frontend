export interface WigProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  isNew?: boolean;
  discount?: number;
}

export interface WigCategory {
  id: number;
  name: string;
  image: string;
  description: string;
}

export interface BlogPost {
  id: number;
  title: string;
  image: string;
  date: string;
  comments: number;
  excerpt: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: number;
  name: string;
  image: string;
  text: string;
  rating: number;
}
