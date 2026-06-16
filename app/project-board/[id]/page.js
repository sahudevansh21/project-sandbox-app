"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProjectBoardPage({ params }) {
  const { id: boardId } = params;
  const router = useRouter();

  const [allBoards, setAllBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [newCardContent, setNewCardContent] = useState({}); // { columnId: content }
  const [editingCardId, setEditingCardId] = useState(null);
  const [editingCardContent, setEditingCardContent] = useState('');
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [editingColumnTitle, setEditingColumnTitle] = useState('');
  const [newColumnTitle, setNewColumnTitle] = useState('');

  useEffect(() => {
    const savedBoards = JSON.parse(localStorage.getItem('boards') || '[]');
    setAllBoards(savedBoards);
    const foundBoard = savedBoards.find((b) => b.id === boardId);
    if (foundBoard) {
      setCurrentBoard(foundBoard);
    } else {
      // If board not found, redirect to dashboard or show error
      router.push('/dashboard');
    }
  }, [boardId, router]);

  useEffect(() => {
    if (currentBoard) {
      const updatedBoards = allBoards.map((b) => (b.id === currentBoard.id ? currentBoard : b));
      localStorage.setItem('boards', JSON.stringify(updatedBoards));
      setAllBoards(updatedBoards); // Keep allBoards state in sync
    }
  }, [currentBoard]); // Only update localStorage when currentBoard changes

  const addColumn = () => {
    if (newColumnTitle.trim() && currentBoard) {
      const newCol = { id: `col-${Date.now()}`, title: newColumnTitle.trim(), cards: [] };
      setCurrentBoard({ ...currentBoard, columns: [...currentBoard.columns, newCol] });
      setNewColumnTitle('');
    }
  };

  const handleColumnTitleChange = (columnId) => {
    if (editingColumnTitle.trim() && currentBoard) {
      setCurrentBoard({
        ...currentBoard,
        columns: currentBoard.columns.map((col) =>
          col.id === columnId ? { ...col, title: editingColumnTitle.trim() } : col
        ),
      });
      setEditingColumnId(null);
      setEditingColumnTitle('');
    }
  };

  const addCard = (columnId) => {
    const content = newCardContent[columnId]?.trim();
    if (content && currentBoard) {
      const newCard = { id: Date.now().toString(), content, status: 'active' };
      setCurrentBoard({
        ...currentBoard,
        columns: currentBoard.columns.map((col) =>
          col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
        ),
      });
      setNewCardContent((prev) => ({ ...prev, [columnId]: '' }));
    }
  };

  const updateCardContent = (cardId, newContent) => {
    if (currentBoard) {
      setCurrentBoard({
        ...currentBoard,
        columns: currentBoard.columns.map((col) => ({
          ...col,
          cards: col.cards.map((card) =>
            card.id === cardId ? { ...card, content: newContent.trim() } : card
          ),
        })),
      });
      setEditingCardId(null);
      setEditingCardContent('');
    }
  };

  const moveCard = (cardId, fromColumnId, toColumnId) => {
    if (!currentBoard || fromColumnId === toColumnId) return;

    let cardToMove = null;
    const updatedColumns = currentBoard.columns.map((col) => {
      if (col.id === fromColumnId) {
        const cardIndex = col.cards.findIndex((c) => c.id === cardId);
        if (cardIndex > -1) {
          cardToMove = col.cards[cardIndex];
          return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
        }
      }
      return col;
    });

    if (cardToMove) {
      setCurrentBoard({
        ...currentBoard,
        columns: updatedColumns.map((col) => {
          if (col.id === toColumnId) {
            return { ...col, cards: [...col.cards, cardToMove] };
          }
          return col;
        }),
      });
    }
  };

  const deleteCard = (cardId, columnId) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      if (currentBoard) {
        setCurrentBoard({
          ...currentBoard,
          columns: currentBoard.columns.map((col) =>
            col.id === columnId ? { ...col, cards: col.cards.filter((card) => card.id !== cardId) } : col
          ),
        });
      }
    }
  };

  const archiveCard = (cardId, columnId) => {
    if (currentBoard) {
      let cardToArchive = null;
      const updatedColumns = currentBoard.columns.map(col => {
        if (col.id === columnId) {
          const cardIndex = col.cards.findIndex(card => card.id === cardId);
          if (cardIndex > -1) {
            cardToArchive = { ...col.cards[cardIndex], archivedAt: Date.now() };
            return { ...col, cards: col.cards.filter(card => card.id !== cardId) };
          }
        }
        return col;
      });

      if (cardToArchive) {
        const archivedCards = JSON.parse(localStorage.getItem('archivedCards') || '[]');
        localStorage.setItem('archivedCards', JSON.stringify([...archivedCards, { boardId: currentBoard.id, boardName: currentBoard.name, card: cardToArchive }]));
        setCurrentBoard({ ...currentBoard, columns: updatedColumns });
      }
    }
  };

  if (!currentBoard) {
    return <div className="container">Loading board or board not found...</div>;
  }

  return (
    <div className="container">
      <div className="project-board-header">
        <h1>{currentBoard.name}</h1>
        <Link href="/dashboard" className="button btn-secondary">Back to Dashboard</Link>
      </div>

      <div className="board-columns">
        {currentBoard.columns.map((column, colIndex) => (
          <div key={column.id} className="board-column">
            <div className="column-header">
              {editingColumnId === column.id ? (
                <input
                  type="text"
                  value={editingColumnTitle}
                  onChange={(e) => setEditingColumnTitle(e.target.value)}
                  onBlur={() => handleColumnTitleChange(column.id)}
                  onKeyPress={(e) => e.key === 'Enter' && handleColumnTitleChange(column.id)}
                  autoFocus
                  className="edit-input"
                />
              ) : (
                <h3 onClick={() => { setEditingColumnId(column.id); setEditingColumnTitle(column.title); }}>
                  {column.title}
                </h3>
              )}
            </div>

            <div className="card-list">
              {column.cards.map((card) => (
                <div key={card.id} className="project-card">
                  {editingCardId === card.id ? (
                    <textarea
                      value={editingCardContent}
                      onChange={(e) => setEditingCardContent(e.target.value)}
                      onBlur={() => updateCardContent(card.id, editingCardContent)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), updateCardContent(card.id, editingCardContent))}
                      autoFocus
                    />
                  ) : (
                    <p className="card-content" onClick={() => { setEditingCardId(card.id); setEditingCardContent(card.content); }}>
                      {card.content}
                    </p>
                  )}
                  <div className="card-actions">
                    {colIndex > 0 && (
                      <button onClick={() => moveCard(card.id, column.id, currentBoard.columns[colIndex - 1].id)} className="btn-secondary">
                        {'<'}
                      </button>
                    )}
                    {colIndex < currentBoard.columns.length - 1 && (
                      <button onClick={() => moveCard(card.id, column.id, currentBoard.columns[colIndex + 1].id)} className="btn-secondary">
                        {'>'}
                      </button>
                    )}
                    <button onClick={() => archiveCard(card.id, column.id)} className="btn-secondary">Archive</button>
                    <button onClick={() => deleteCard(card.id, column.id)} className="btn-danger">Delete</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder="Add new card..."
                value={newCardContent[column.id] || ''}
                onChange={(e) => setNewCardContent((prev) => ({ ...prev, [column.id]: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && addCard(column.id)}
              />
              <button onClick={() => addCard(column.id)}>Add</button>
            </div>
          </div>
        ))}

        <div className="add-column-area glass-card">
          <input
            type="text"
            placeholder="New column title..."
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addColumn()}
          />
          <button onClick={addColumn}>Add Column</button>
        </div>
      </div>
    </div>
  );
}
