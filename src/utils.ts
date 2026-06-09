/**
 * Shared utility helpers for Revideo scenes.
 * Keeps scene files small and avoids code duplication.
 */

/** Color palette used across IDE and terminal panels */
export const COLORS = {
  // VS Code-style dark theme colors
  ideBg: '#1e1e1e',
  ideSidebar: '#252526',
  ideTabBar: '#2d2d2d',
  ideTabActive: '#1e1e1e',
  ideText: '#d4d4d4',
  ideKeyword: '#569cd6',
  ideString: '#ce9178',
  ideComment: '#6a9955',
  ideLineNum: '#858585',

  // Terminal colors
  termBg: '#0c0c0c',
  termText: '#00ff00',
  termPrompt: '#00ff00',
  termCursor: '#ffffff',

  // Layout
  panelBorder: '#3c3c3c',
};

/** Standard font settings for code display */
export const CODE_FONT = {
  family: 'monospace',
  size: 24,
  lineHeight: 32,
};
