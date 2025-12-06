'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { Search as SearchIcon, Loader2, FileText } from 'lucide-react';

export function AISearch() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  // 快捷键监听
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // 防抖搜索
  React.useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms 防抖

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (slug: string) => {
    setOpen(false);
    router.push(`/posts/${slug}`);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-500 hover:border-gray-300 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800 transition-all w-32 sm:w-64"
      >
        <SearchIcon className="h-4 w-4" />
        <span className="flex-1 text-left">AI 搜索...</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 opacity-50 group-hover:opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {open && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setOpen(false)} 
          />
          
          {/* Dialog */}
          <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-200 dark:bg-gray-950 dark:ring-gray-800 animate-in fade-in zoom-in-95 duration-200">
            <Command className="w-full">
              <div className="flex items-center border-b border-gray-100 px-3 dark:border-gray-800">
                <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Command.Input
                  placeholder="问点什么... (例如: Next.js 怎么优化?)"
                  className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-50"
                  value={query}
                  onValueChange={setQuery}
                  autoFocus
                />
              </div>
              
              <Command.List className="max-h-[300px] overflow-y-auto p-2">
                {!query && (
                  <div className="py-6 text-center text-sm text-gray-500">
                    输入关键词，AI 将为你查找相关内容
                  </div>
                )}

                {query && loading && (
                  <div className="flex items-center justify-center py-6 text-sm text-gray-500">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    思考中...
                  </div>
                )}

                {query && !loading && results.length === 0 && (
                  <div className="py-6 text-center text-sm text-gray-500">
                    没找到相关内容
                  </div>
                )}

                {results.map((item, i) => (
                  <Command.Item
                    key={`${item.slug}-${i}`}
                    onSelect={() => handleSelect(item.slug)}
                    className="relative flex cursor-pointer select-none items-start gap-3 rounded-sm px-3 py-3 text-sm outline-none aria-selected:bg-gray-100 aria-selected:text-gray-900 dark:aria-selected:bg-gray-800 dark:aria-selected:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 opacity-50" />
                    <div className="flex flex-col gap-1">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-xs text-gray-500 line-clamp-2">
                            {item.content}
                        </span>
                    </div>
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
