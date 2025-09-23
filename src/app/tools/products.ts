export type Product = {
  id: number;
  name: string;
  collection: 'Raw Hair' | 'Virgin Hair' | 'Lace Closures' | 'Hair Tools';
  style: 'Straight' | 'Burmese' | 'Deep Curly' | 'Kinky Curly' | 'Kinky Straight' | 'Frontal Film' | 'HD Lace' | 'Tool';
  price: number;
  imageUrl: string;
  lengths: number[];
  isNew: boolean;
};

export const products: Product[] = [
  {
    id: 1,
    name: 'Raw Straight Hair',
    collection: 'Raw Hair',
    style: 'Straight',
    price: 180,
    imageUrl: '/images/wigstyles1.jpg', 
    lengths: [14, 16, 18, 20, 22, 24, 26, 28],
    isNew: true,
  },
  {
    id: 2,
    name: 'Virgin Burmese Hair',
    collection: 'Virgin Hair',
    style: 'Burmese',
    price: 165,
    imageUrl: '/images/wigcollection1.jpg', 
    lengths: [14, 16, 18, 20, 22, 24, 26, 28],
    isNew: false,
  },
  {
    id: 3,
    name: 'Virgin Deep Curly Hair',
    collection: 'Virgin Hair',
    style: 'Deep Curly',
    price: 175,
    imageUrl: '/images/wigstyles2.jpg', 
    lengths: [14, 16, 18, 20, 22, 24, 26, 28],
    isNew: true,
  },
    {
    id: 4,
    name: 'Virgin Kinky Curly Hair',
    collection: 'Virgin Hair',
    style: 'Kinky Curly',
    price: 170,
    imageUrl: '/images/popular1.jpg', 
    lengths: [14, 16, 18, 20, 22, 24, 26, 28],
    isNew: false,
  },
  {
    id: 5,
    name: 'Virgin Kinky Straight Hair',
    collection: 'Virgin Hair',
    style: 'Kinky Straight',
    price: 160,
    imageUrl: '/images/wigstyles3.jpg', 
    lengths: [14, 16, 18, 20, 22, 24, 26, 28],
    isNew: false,
  },
  {
    id: 6,
    name: '13x6 Frontal Film Straight',
    collection: 'Lace Closures',
    style: 'Frontal Film',
    price: 120,
    imageUrl: '/images/shop1.jpg', 
    lengths: [12, 14, 16, 18],
    isNew: true,
  },
  {
    id: 7,
    name: '5x5 HD Lace Burmese',
    collection: 'Lace Closures',
    style: 'HD Lace',
    price: 95,
    imageUrl: '/images/shop2.jpg', 
    lengths: [12, 14, 16, 18],
    isNew: false,
  },
  {
    id: 8,
    name: 'Edge Brush & Rat Tail Comb',
    collection: 'Hair Tools',
    style: 'Tool',
    price: 15,
    imageUrl: '/images/comb.png', 
    lengths: [],
    isNew: false,
  },
   {
    id: 9,
    name: '5x5 HD Lace Deep Curly',
    collection: 'Lace Closures',
    style: 'HD Lace',
    price: 105,
    imageUrl: '/images/shop3.jpg', 
    lengths: [12, 14, 16, 18],
    isNew: false,
  },
];