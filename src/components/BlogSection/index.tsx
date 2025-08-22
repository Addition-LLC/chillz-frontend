import React from 'react';
import Image from 'next/image'; // Imported next/image
import { Calendar, MessageSquare } from 'lucide-react'; // Imported icons from lucide-react

const blogPosts = [
  {
    title: 'Maintain Your Wig Like A Pro',
    date: 'Jan 15, 2023',
    comments: 12,
    image: '/images/blog1.jpg',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod mauris.',
  },
  {
    title: 'Easy Wig Maintenance Tips',
    date: 'Jan 15, 2023',
    comments: 12,
    image: '/images/blog2.jpg',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod mauris.',
  },
  {
    title: '2025 Wig Styling Trends',
    date: 'Jan 15, 2023',
    comments: 12,
    image: '/images/blog3.jpg',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod mauris.',
  },
];

const BlogSection: React.FC = () => {
  return (
    <div className="flex flex-col items-center py-10 bg-[#FBF6ED]">
      <h2
        className="text-2xl sm:text-4xl  mb-8"
        style={{
          fontFamily: "'ARP', Arial, sans-serif",
          fontWeight: 800,
        }}
      >
        LATEST FROM BLOG
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        {blogPosts.map((post) => (
          <div
            key={post.title}
            className="bg-[#FBF6ED] rounded-lg overflow-hidden"
          >
            {/* Replaced <img> with next/image */}
            <Image
              src={post.image}
              alt={post.title}
              width={400}
              height={256}
              className="w-full rounded-xl h-64 object-cover"
            />

            <div className="py-4">
              <h3
                className="text-lg font-extrabold mb-2"
                style={{
                  fontFamily: "'ARP', Arial, sans-serif",
                }}
              >
                {post.title}
              </h3>
              <div className="flex items-center text-gray-500 text-sm mb-2">
                {/* Replaced emoji with Lucide Icon */}
                <span className="flex items-center mr-4 text-[#5E3B1E]">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  {post.date}
                </span>

                {/* Replaced emoji with Lucide Icon */}
                <span className="flex items-center text-[#5E3B1E]">
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  {post.comments} Comments
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{post.content}</p>
              <button className="py-2 bg-brown-700 text-[#5E3B1E] font-semibold rounded hover:bg-brown-800">
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
