"use client";

import { useEffect, useState } from "react";

/**
 * A client-side component that safely renders HTML content from markdown.
 * Uses a state variable to prevent hydration mismatches between server and client.
 * 
 * @param {Object} props - Component props
 * @param {string} props.excerpt - The HTML content to be rendered
 * @returns {JSX.Element} A paragraph element with the rendered content
 */
export default function DynamicExcerpt({ excerpt }) {
  const [safeExcerpt, setSafeExcerpt] = useState("");

  useEffect(() => {
    setSafeExcerpt(excerpt);
  }, [excerpt]);

  return <p dangerouslySetInnerHTML={{ __html: safeExcerpt }} />;
}
