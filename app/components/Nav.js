"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Nav() {
  const pathname = usePathname();
  const [firstBoardId, setFirstBoardId] = useState(null);

  useEffect(() => {
    const savedBoards = JSON.parse(localStorage.getItem('boards') || '[]');
    if (savedBoards.length > 0) {
      setFirstBoardId(savedBoards[0].id);
    }
  }, []);

  return (
    <nav>
      <Link href="/dashboard" className="logo">
        Project Sandbox
      </Link>
      <ul>
        <li>
          <Link href="/dashboard" className={pathname === '/dashboard' ? 'active' : ''}>
            Dashboard
          </Link>
        </li>
        <li>
          {firstBoardId ? (
            <Link href={`/project-board/${firstBoardId}`} className={pathname.startsWith('/project-board/') ? 'active' : ''}>
              Board
            </Link>
          ) : (
            <Link href="/dashboard" className={pathname.startsWith('/project-board/') ? 'active' : ''} style={{ opacity: 0.6, cursor: 'not-allowed' }}>
              Board (Create one first)
            </Link>
          )}
        </li>
        <li>
          <Link href="/archives" className={pathname === '/archives' ? 'active' : ''}>
            Archives
          </Link>
        </li>
      </ul>
    </nav>
  );
}
