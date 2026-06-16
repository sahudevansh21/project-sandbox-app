"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState('');

  useEffect(() => {
    const savedBoards = JSON.parse(localStorage.getItem('boards') || '[]');
    setBoards(savedBoards);
  }, []);

  useEffect(() => {
    localStorage.setItem('boards', JSON.stringify(boards));
  }, [boards]);

  const addBoard = () => {
    if (newBoardName.trim()) {
      const newBoard = {
        id: Date.now().toString(),
        name: newBoardName.trim(),
        columns: [
          { id: 'col-ideas-' + Date.now(), title: 'Ideas', cards: [] },
          { id: 'col-doing-' + Date.now(), title: 'Doing', cards: [] },
          { id: 'col-done-' + Date.now(), title: 'Done', cards: [] },
        ],
      };
      setBoards([...boards, newBoard]);
      setNewBoardName('');
    }
  };

  const deleteBoard = (id) => {
    if (window.confirm('Are you sure you want to delete this board and all its contents?')) {
      setBoards(boards.filter((board) => board.id !== id));
      // Also clean up any archived cards from this board
      const archivedCards = JSON.parse(localStorage.getItem('archivedCards') || '[]');
      localStorage.setItem('archivedCards', JSON.stringify(archivedCards.filter(item => item.boardId !== id)));
    }
  };

  return (
    <div className="container">
      <h1>Your Project Boards</h1>

      <div className="input-group" style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="New board name..."
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addBoard()}
        />
        <button onClick={addBoard}>Add Board</button>
      </div>

      {boards.length === 0 ? (
        <p className="text-muted">No boards yet. Start by adding a new one above!</p>
      ) : (
        <div className="dashboard-grid">
          {boards.map((board) => (
            <div key={board.id} className="glass-card board-card">
              <Link href={`/project-board/${board.id}`}>
                <h3>{board.name}</h3>
                <p className="text-muted">{board.columns.reduce((sum, col) => sum + col.cards.length, 0)} cards</p>
              </Link>
              <div className="board-actions">
                <Link href={`/project-board/${board.id}`} className="button" style={{ background: 'var(--accent-purple)' }}>Open</Link>
                <button onClick={() => deleteBoard(board.id)} className="btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
