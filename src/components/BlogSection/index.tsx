'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MessageSquare } from 'lucide-react';

const blogPosts = [
  {
    title: 'Maintain Your Wig Like A Pro',
    date: 'Sep 18, 2025',
    comments: 12,
    image: '/images/blog1.jpg',
    excerpt: 'Discover the essential tips and tricks to keep your wig looking flawless and extend its lifespan. From washing to styling, we cover it all.',
    href: '#',
  },
  {
    title: 'Easy Wig Maintenance Tips',
    date: 'Sep 12, 2025',
    comments: 8,
    image: '/images/blog2.jpg',
    excerpt: 'Short on time? These quick and easy maintenance tips will ensure your hair is always ready for the day ahead.',
    href: '#',
  },
  {
    title: '2025 Wig Styling Trends',
    date: 'Sep 05, 2025',
    comments: 21,
    image: '/images/blog3.jpg',
    excerpt: 'Get ahead of the curve with our forecast of the hottest wig styling trends for the upcoming year.',
    href: '#',
  },
];

const BlogSection: React.FC = () => {
  const featuredPost = blogPosts[0];
  const recentPosts = blogPosts.slice(1);

  return (
    <div className="bg-brand-secondary-bg py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold text-brand-brown"
            style={{ fontFamily: 'var(--font-playfair-display)' }}
          >
            Latest From Our Blog
          </h2>
          <p className="mt-4 text-lg text-brand-brown/80 max-w-2xl mx-auto">
            Insights, tutorials, and the latest trends from the world of luxury hair.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* --- Featured Post (Left Column) --- */}
          <div className="lg:col-span-2">
            <Link href={featuredPost.href} className="group block">
              <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="py-6">
                <div className="flex items-center text-brand-brown/60 text-sm mb-2">
                  <span className="flex items-center mr-4">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1.5" />
                    {featuredPost.comments} Comments
                  </span>
                </div>
                <h3
                  className="text-2xl font-bold text-brand-brown transition-colors group-hover:text-brand-pink"
                  style={{ fontFamily: 'var(--font-playfair-display)' }}
                >
                  {featuredPost.title}
                </h3>
                <p className="text-brand-brown/80 text-base mt-2">{featuredPost.excerpt}</p>
              </div>
            </Link>
          </div>

          {/* --- Recent Posts (Right Column) --- */}
          <div className="flex flex-col space-y-8">
             <h4 className="text-xl font-bold text-brand-brown border-b border-brand-brown/20 pb-2" style={{ fontFamily: 'var(--font-playfair-display)' }}>Recent Articles</h4>
            {recentPosts.map((post) => (
              <Link href={post.href} key={post.title} className="group flex items-center gap-4">
                <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-brown transition-colors group-hover:text-brand-pink" style={{ fontFamily: 'var(--font-playfair-display)' }}>
                    {post.title}
                  </h3>
                  <p className="text-sm text-brand-brown/60 mt-1">{post.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;