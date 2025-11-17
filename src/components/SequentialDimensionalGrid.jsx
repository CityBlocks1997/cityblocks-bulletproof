import React from 'react';

// Calculate grid layout based on number of videos - 3 rows x 4 cols horizontal layout
export function getGridLayout(count) {
  if (count === 1) return { rows: 1, cols: 1, label: '1x1 Fullscreen' };
  if (count === 2) return { rows: 1, cols: 2, label: '1x2 Side-by-Side' };
  if (count === 3) return { rows: 1, cols: 3, label: '1x3 Three-in-Row' };
  if (count === 4) return { rows: 1, cols: 4, label: '1x4 Full Row' };
  if (count <= 8) return { rows: 2, cols: 4, label: '2x4 Grid' };
  return { rows: 3, cols: 4, label: '3x4 Grid (12 videos)' };
}

// Calculate position for each video in the grid
export function getGridPosition(index, totalCount) {
  const { rows, cols } = getGridLayout(totalCount);
  
  const row = Math.floor(index / cols);
  const col = index % cols;
  
  const cellWidth = 100 / cols;
  const cellHeight = 100 / rows;
  
  return {
    top: `${row * cellHeight}%`,
    left: `${col * cellWidth}%`,
    width: `${cellWidth}%`,
    height: `${cellHeight}%`
  };
}