"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Archives() {
  const [archivedCards, setArchivedCards] = useState([]);

  useEffect(() => {
    const savedArchivedCards = JSON.parse(localStorage.getItem('archivedCards') || '[]');
    setArchivedCards(savedArchivedCards);
  }, []);

  const restoreCard = (cardToRestore, boardId, cardId) => {
    if (window.confirm('Are you sure you want to restore this card? It will be moved to the first column of its original board.')) {
      const allBoards = JSON.parse(localStorage.getItem('boards') || '[]');
      const targetBoardIndex = allBoards.findIndex(board => board.id === boardId);

      if (targetBoardIndex !== -1 && allBoards[targetBoardIndex].columns.length > 0) {
        // Remove from archives
        const updatedArchived = archivedCards.filter(item => !(item.boardId === boardId && item.card.id === cardId));
        setArchivedCards(updatedArchived);
        localStorage.setItem('archivedCards', JSON.stringify(updatedArchived));

        // Add to the first column of the original board
        const updatedBoards = [...allBoards];
        const firstColumn = updatedBoards[targetBoardIndex].columns[0];
        firstColumn.cards.push({ ...cardToRestore, status: 'active' }); // Restore status
        localStorage.setItem('boards', JSON.stringify(updatedBoards));
        alert('Card restored to the first column of the original board!');
      } else {
        alert('Original board not found or has no columns. Please create the board first or add a column to restore.');
      }
    }
  };

  const deleteArchivedCard = (boardId, cardId) => {
    if (window.confirm('Are you sure you want to permanently delete this archived card?')) {
      const updatedArchived = archivedCards.filter(item => !(item.boardId === boardId && item.card.id === cardId));
      setArchivedCards(updatedArchived);
      localStorage.setItem('archivedCards', JSON.stringify(updatedArchived));
    }
  };

  return (
    <div className="container">
      <h1>Archived Cards</h1>

      {archivedCards.length === 0 ? (
        <p className="text-muted">No cards have been archived yet.</p>
      ) : (
        <div className="archive-grid">
          {archivedCards.map((item) => (
            <div key={`${item.boardId}-${item.card.id}`} className="glass-card archived-card-item">
              <p className="card-content">{item.card.content}</p>
              <p className="card-metadata text-muted">
                From board: <Link href={`/project-board/${item.boardId}`} style={{ textDecoration: 'underline', color: 'var(--accent-blue)' }}>{item.boardName || 'Unknown Board'}</Link>
                <br/>
                Archived on: {item.card.archivedAt ? new Date(item.card.archivedAt).toLocaleDateString() : 'N/A'}
              </p>
              <div className="card-actions" style={{ justifyContent: 'flex-start', marginTop: '1rem' }}>
                <button onClick={() => restoreCard(item.card, item.boardId, item.card.id)} className="button">Restore</button>
                <button onClick={() => deleteArchivedCard(item.boardId, item.card.id)} className="btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
