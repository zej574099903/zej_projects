import Link from 'next/link';
import { Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-8 mt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center gap-2 text-sm text-gray-400 dark:text-gray-500">
      <p>© {new Date().getFullYear()} Liora Blog. All rights reserved.</p>
      <Link 
        href="/admin" 
        className="flex items-center gap-1 text-xs opacity-30 hover:opacity-100 hover:text-blue-600 transition-all"
        title="后台管理"
      >
        <Lock className="w-3 h-3" />
        <span>Manage</span>
      </Link>
    </footer>
  );
}
