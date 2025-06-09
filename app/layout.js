import "./globals.css";
import { SITE_URL } from '@/config';
import { Inter } from "next/font/google";
import Link from "next/link";
import NavBar from "./components/NavBar";

/**
 * Initialize Inter font with Latin subset and swap display for better performance.
 * Using 'swap' ensures text remains visible during font loading.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

/**
 * Metadata configuration for the application.
 * Used by search engines and social media platforms for SEO and link previews.
 */
export const metadata = {
  title: "Your Name - Your Tagline",
  description: "Join Your Name Here",
};

/**
 * Root layout component that wraps all pages in the application.
 * Provides consistent structure including header, main content, and footer.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered
 * @returns {JSX.Element} The root layout structure
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-white dark:bg-black text-gray-900 dark:text-gray-200 antialiased">
        <header className="border-b border-gray-200 py-4">
          <NavBar />
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          {children}
        </main>
        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8 text-center text-gray-600 dark:text-gray-400">
          <p>Written by Your Name</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} · <Link href="/feed" className="hover:underline">RSS Feed</Link></p>
          <p className="text-sm mt-2">Built with <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Next.js</a> and deployed on <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Vercel</a></p>
        </footer>
      </body>
    </html>
  );
}