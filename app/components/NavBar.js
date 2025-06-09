"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Navigation bar component that provides site-wide navigation.
 * Features a responsive design with a mobile-friendly hamburger menu.
 * Uses client-side state to toggle the mobile menu visibility.
 * 
 * @returns {JSX.Element} The navigation bar with responsive menu
 */
export default function NavBar() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <nav className="container mx-auto px-4 max-w-2xl flex items-center justify-between">
      {/* Logo / Home link */}
      <Link href="/" className="text-xl font-semibold">
        Home
      </Link>

      {/* Hamburger button (shown on mobile) */}
      <button
        className="text-2xl md:hidden focus:outline-none"
        onClick={() => setNavOpen(!navOpen)}
        aria-label="Toggle Navigation"
      >
        ☰
      </button>

      {/* Nav links */}
      <div
        className={`
          ${navOpen ? "block" : "hidden"} 
          absolute md:static top-[4.5rem] left-0 w-full md:w-auto 
          bg-white dark:bg-black md:bg-transparent p-4 md:p-0
          md:flex md:space-x-6
        `}
      >
        <Link
          href="/about"
          className="block mb-2 md:mb-0 text-gray-600 dark:text-gray-300 
                     hover:text-gray-900 dark:hover:text-gray-100 md:inline-block"
        >
          About
        </Link>
        <Link
          href="/social"
          className="block mb-2 md:mb-0 text-gray-600 dark:text-gray-300 
                     hover:text-gray-900 dark:hover:text-gray-100 md:inline-block"
        >
          Social
        </Link>
        <Link
          href="/posts"
          className="block mb-2 md:mb-0 text-gray-600 dark:text-gray-300 
                     hover:text-gray-900 dark:hover:text-gray-100 md:inline-block"
        >
          Posts
        </Link>
      </div>
    </nav>
  );
}
