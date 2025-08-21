// app/components/Header/menuData.ts

import { Menu } from "@/types/menu"; // Assuming you have this type defined elsewhere

export const menuData: Menu[] = [
  {
    id: 1,
    title: "HOME",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "WIGS",
    path: "/wigs",
    newTab: false,
  },
  {
    id: 3,
    title: "LACES",
    path: "/laces",
    newTab: false,
  },
  {
    id: 4,
    title: "ABOUT US",
    path: "/about",
    newTab: false,
  },
  {
    id: 5,
    title: "BLOG",
    path: "/blog",
    newTab: false,
  },
  {
    id: 6,
    title: "FAQ",
    path: "/faq",
    newTab: false,
  },
  {
    id: 7,
    title: "CONTACT US",
    path: "/contact",
    newTab: false,
  },
];