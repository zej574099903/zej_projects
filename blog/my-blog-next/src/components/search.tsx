"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search as SearchIcon, FileText, User, Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { PostData } from "@/lib/posts";

interface SearchProps {
  posts: PostData[];
}

export function Search({ posts }: SearchProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  // 监听快捷键
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      // 按下 ESC 关闭
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      {/* 触发按钮 */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 transition-colors rounded-md hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 ring-1 ring-gray-200 dark:ring-gray-800 bg-gray-50/50 dark:bg-gray-900/50"
      >
        <SearchIcon className="w-4 h-4" />
        <span className="hidden sm:inline-block">搜索...</span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-500 opacity-100 dark:bg-gray-800 dark:text-gray-400">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* 搜索弹窗 - 自定义 Modal 实现以避免 Radix UI DialogTitle 报错 */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] sm:pt-[15vh]">
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
            onClick={() => setOpen(false)}
          />
          
          {/* 搜索框主体 */}
          <div className="relative w-full max-w-xl mx-4 z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
            <Command 
              label="Global Search"
              className="w-full bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center border-b border-gray-200 dark:border-gray-800 px-4">
                <SearchIcon className="w-5 h-5 text-gray-500 mr-2" />
                <Command.Input 
                  placeholder="搜索文章、页面或功能..." 
                  className="w-full py-4 text-base bg-transparent outline-none placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
                  autoFocus
                />
              </div>
              
              <Command.List className="max-h-[300px] overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-sm text-gray-500">
                  未找到相关结果
                </Command.Empty>

                <Command.Group heading="文章" className="text-xs font-medium text-gray-500 px-2 mb-2 mt-2 select-none">
                  {posts.map((post) => (
                    <Command.Item
                      key={post.id}
                      onSelect={() => runCommand(() => router.push(`/posts/${post.id}`))}
                      className="flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer text-sm text-gray-700 dark:text-gray-200 aria-selected:bg-blue-50 aria-selected:text-blue-700 dark:aria-selected:bg-blue-900/20 dark:aria-selected:text-blue-200 transition-colors"
                    >
                      <FileText className="w-4 h-4 opacity-70" />
                      <div className="flex flex-col">
                        <span>{post.title}</span>
                        <span className="text-xs text-gray-400 font-normal line-clamp-1">{post.description}</span>
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Separator className="my-2 h-px bg-gray-100 dark:bg-gray-800" />

                <Command.Group heading="页面" className="text-xs font-medium text-gray-500 px-2 mb-2 mt-2 select-none">
                  <Command.Item
                    onSelect={() => runCommand(() => router.push('/resume'))}
                    className="flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer text-sm text-gray-700 dark:text-gray-200 aria-selected:bg-blue-50 aria-selected:text-blue-700 dark:aria-selected:bg-blue-900/20 dark:aria-selected:text-blue-200 transition-colors"
                  >
                    <User className="w-4 h-4 opacity-70" />
                    简历
                  </Command.Item>
                  {/* <Command.Item
                    onSelect={() => runCommand(() => router.push('/projects'))}
                    className="flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer text-sm text-gray-700 dark:text-gray-200 aria-selected:bg-blue-50 aria-selected:text-blue-700 dark:aria-selected:bg-blue-900/20 dark:aria-selected:text-blue-200 transition-colors"
                  >
                    <Laptop className="w-4 h-4 opacity-70" />
                    项目
                  </Command.Item> */}
                </Command.Group>
              </Command.List>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
