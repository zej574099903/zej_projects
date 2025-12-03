"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Tag, Folder } from 'lucide-react';
import { type PostData } from '@/lib/posts';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function PostsList({ posts }: { posts: PostData[] }) {
  // Get unique categories
  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category))).filter(Boolean)];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              selectedCategory === category
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md transform scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <motion.div 
        layout
        className="grid gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredPosts.map(({ id, date, title, description, tags, category }) => (
            <motion.article
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              key={id} 
              className="group relative flex flex-col space-y-3 border p-6 rounded-2xl hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-600 transition-colors bg-white dark:bg-gray-900/50 shadow-sm"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  {/* Category Label */}
                  <div className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
                    <Folder className="w-3 h-3" />
                    {category}
                  </div>
                  
                  <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <Link href={`/posts/${id}`}>
                      <span className="absolute inset-0" />
                      {title}
                    </Link>
                  </h3>
                </div>
                
                <time className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap flex items-center gap-1 shrink-0">
                  <Calendar className="w-3 h-3" />
                  {date}
                </time>
              </div>
              
              <p className="text-gray-500 dark:text-gray-400 line-clamp-2 text-sm leading-relaxed">
                {description}
              </p>

              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 border border-transparent dark:border-gray-700/50">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </AnimatePresence>
        
        {filteredPosts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-gray-500 dark:text-gray-400"
          >
            没有找到相关文章
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
