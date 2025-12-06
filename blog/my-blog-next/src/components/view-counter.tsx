'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

interface ViewCounterProps {
  slug: string;
  initialViews?: number;
  trackView?: boolean; // 是否触发阅读量增加，默认为 true
}

export const ViewCounter = ({ slug, initialViews = 0, trackView = true }: ViewCounterProps) => {
  const [views, setViews] = useState<number>(initialViews);

  useEffect(() => {
    const controller = new AbortController();

    const fetchViews = async () => {
      try {
        // 如果 trackView 为 true，使用 POST (增加并获取)
        // 如果 trackView 为 false，使用 GET (仅获取)
        const method = trackView ? 'POST' : 'GET';
        const url = trackView ? '/api/views' : `/api/views?slug=${slug}`;
        
        const options: RequestInit = {
            method,
            headers: trackView ? { 'Content-Type': 'application/json' } : undefined,
            body: trackView ? JSON.stringify({ slug }) : undefined,
            signal: controller.signal,
        };

        const res = await fetch(url, options);
        if (res.ok) {
            const data = await res.json();
            if (typeof data.views === 'number') {
                setViews(data.views);
            }
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            return;
        }
        console.error('Failed to update view count:', error);
      }
    };

    fetchViews();

    return () => {
      controller.abort();
    };
  }, [slug, trackView]);

  return (
    <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm" title={`${views.toLocaleString()} views`}>
        <Eye className="w-4 h-4" />
        <span>{views > 0 ? views.toLocaleString() : '...'}</span>
    </span>
  );
};
