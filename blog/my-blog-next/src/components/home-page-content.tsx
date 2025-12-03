"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { type PostData } from '@/lib/posts';
import { cn } from '@/lib/utils';

export default function HomePageContent({ posts }: { posts: PostData[] }) {
  // 动画变体配置
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-20 relative">
      {/* 全局背景装饰 */}
      <div className="absolute inset-0 -z-20 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 text-center lg:pt-32 lg:pb-24">
        {/* 背景装饰：弥散光感 - 针对亮色模式优化 */}
        <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-400/20 blur-[120px] opacity-60 mix-blend-multiply" />
        <div className="absolute top-20 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-purple-400/20 blur-[100px] opacity-50 mix-blend-multiply" />
        <div className="absolute bottom-0 left-20 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-400/20 blur-[100px] opacity-40 mix-blend-multiply" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl px-4"
        >
          {/* 调整：dark 模式下使用 from-white via-gray-100 to-gray-300，确保非常亮 */}
          <h1 className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-white dark:via-gray-100 dark:to-gray-300 sm:text-7xl mb-6">
            Designing the <br />
            <span className="text-blue-600 dark:text-blue-400">Future of Web</span>
          </h1>
          
          {/* 调整：dark:text-gray-200，提升正文亮度 */}
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-200 sm:text-xl leading-relaxed">
            你好，我是 <span className="font-bold text-gray-900 dark:text-white underline decoration-blue-500/30 decoration-2 underline-offset-4">Liora</span>。
            <br />
            一名热衷于构建极致用户体验的前端工程师。
            这里记录我的代码、思考与创造。
          </p>

          <div className="flex justify-center gap-4">
            <Link 
              href="/posts"
              className="group inline-flex items-center justify-center rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-700 hover:shadow-lg dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              阅读文章
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Blog Posts Section */}
      <section className="mx-auto max-w-5xl px-4">
        <div className="flex items-center justify-between mb-10">
          {/* 调整：dark:text-white，纯白标题 */}
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            精选文章
          </h2>
          <Link href="/posts" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            查看全部 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6"
        >
          {/* Feature Post (第一篇) - 横向通栏布局 */}
          {posts.length > 0 && (
            <motion.article
              key={posts[0].id}
              variants={item}
              className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-200/50 transition-all hover:shadow-xl hover:-translate-y-1 hover:ring-blue-100"
            >
              {/* 装饰背景 */}
              <div className="absolute top-0 right-0 -z-10 h-[300px] w-[300px] translate-x-1/3 -translate-y-1/3 rounded-full bg-blue-50/50 blur-3xl transition-all group-hover:bg-blue-100/50" />
              
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {posts[0].tags?.map(tag => (
                      <span key={tag} className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 ring-1 ring-blue-100/50">
                        {tag}
                      </span>
                    ))}
                    <time className="flex items-center gap-1 text-sm text-gray-400 pl-2 border-l border-gray-200">
                      <Calendar className="h-3.5 w-3.5" />
                      {posts[0].date}
                    </time>
                  </div>

                  <h3 className="text-3xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                    <Link href={`/posts/${posts[0].id}`}>
                      <span className="absolute inset-0" />
                      {posts[0].title}
                    </Link>
                  </h3>

                  <p className="text-gray-500 leading-relaxed line-clamp-2 max-w-2xl text-lg">
                    {posts[0].description}
                  </p>
                </div>

                <div className="flex-shrink-0 self-end md:self-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 transition-all group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </motion.article>
          )}

          {/* Secondary Posts (后两篇) - 并排布局 */}
          <div className="grid gap-6 md:grid-cols-2">
            {posts.slice(1, 3).map(({ id, date, title, description, tags }) => (
              <motion.article 
                key={id} 
                variants={item}
                className="group relative flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/50 transition-all hover:shadow-lg hover:-translate-y-1 hover:ring-gray-300/50"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 text-xs text-gray-500 mb-4">
                    <time className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {date}
                    </time>
                  </div>

                  <h3 className="mb-3 text-xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                    <Link href={`/posts/${id}`}>
                      <span className="absolute inset-0" />
                      {title}
                    </Link>
                  </h3>

                  <p className="text-gray-500 line-clamp-2 leading-relaxed text-sm mb-4">
                    {description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <div className="flex gap-2">
                    {tags?.slice(0, 2).map(tag => (
                      <span key={tag} className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
