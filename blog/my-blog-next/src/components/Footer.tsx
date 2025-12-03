export default function Footer() {
  return (
    <footer className="py-8 mt-8 border-t border-gray-100 dark:border-gray-800 text-center text-gray-400 dark:text-gray-500 text-sm">
      <p>© {new Date().getFullYear()} My Blog. All rights reserved.</p>
    </footer>
  );
}
