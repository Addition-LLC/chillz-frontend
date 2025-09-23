export type MenuItem = {
  title: string;
  href: string;
};

export type MegaMenuCategory = {
  title: string;
  items: MenuItem[];
};

export type Menu = {
  id: number;
  title: string;
  path?: string;
  newTab: boolean;
  submenu?: {
    categories: MegaMenuCategory[];
    promo?: {
      imageSrc: string;
      title: string;
      description: string;
      href: string;
    };
  };
};

export const menuData: Menu[] = [
  {
    id: 1,
    title: "HOME",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "HAIR TOOLS", 
    path: "/tools",
    newTab: false,
    submenu: {
      categories: [
        {
          title: "Wigs by Style",
          items: [
            { title: "Full Lace Wigs", href: "/wigs/full-lace" },
            { title: "Lace Front Wigs", href: "/wigs/lace-front" },
            { title: "Bob Wigs", href: "/wigs/bob" },
            { title: "HD Lace Wigs", href: "/wigs/hd-lace" },
          ],
        },
        {
          title: "Extensions",
          items: [
            { title: "Clip-In Extensions", href: "/extensions/clip-in" },
            { title: "Tape-In Extensions", href: "/extensions/tape-in" },
            { title: "Weft Bundles", href: "/extensions/weft" },
          ],
        },
      ],
      // promo: {
      //   imageSrc: "/images/new-arrival.png", 
      //   title: "New Arrivals",
      //   description: "Shop the latest styles",
      //   href: "/new-arrivals",
      // },
    },
  },
  {
    id: 3,
    title: "CLOSURES", 
    path: "/closures",
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