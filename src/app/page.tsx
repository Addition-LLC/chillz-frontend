
import { Metadata } from "next";
import Hero from "@/components/Hero";
import WigCollection from "@/components/WigCollection";
import WigStyles from "@/components/WigStyles";
import NewToWigs from "@/components/NewToWigs";
import ShopByCategory from "@/components/ShopByCategory";
import Features from "@/components/Features";
// import BlogSection from "@/components/BlogSection";
import Newsletter from "@/components/Newsletter";
import NewToWigs1 from "@/components/NewToWigs1";
import Highlight from "@/components/Highlight";



export const metadata: Metadata = {
  title: "ChilzStyles - Premium Human Hair Wigs",
  description: "Premium quality wigs made from ethically sourced human hair. Designed for comfort, style, and confidence.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <WigCollection />
      <WigStyles />
      <NewToWigs /> 
      <ShopByCategory />
      <Features />
      {/* <VideoSection /> */}
      <NewToWigs1 />
      {/* <PopularLooks /> */}
      <Highlight />
      {/* <BlogSection /> */}
      <Newsletter />  
    </>
  );
}
