/**
 * Emacs Init scene — teaches init.el configuration one feature at a time.
 * Left: IDE types code. Right: Emacs shows the effect.
 */
import {makeScene2D} from '@revideo/2d';
import {waitFor} from '@revideo/core';
import {IDE} from '../ide';
import {Emacs} from '../emacs';
import {COLORS} from '../utils';

export const emacsInitScene = makeScene2D('emacs-init', function* (view) {
  const ide = new IDE(view);
  const emacs = new Emacs();
  emacs.attach(ide.vizRef());

  // Setup explorer
  ide.explorer.addFolder('.emacs.d');
  ide.explorer.addFile('init.el', 1, true);
  ide.editor.setFile('init.el');

  // --- Section 0: Start and close Emacs ---
  yield* ide.editor.typeLine(';; Start emacs from terminal', COLORS.ideComment);
  yield* ide.editor.typeLine('');
  yield* ide.console.type('emacs');
  yield* emacs.appear();
  yield* emacs.showWelcome();
  yield* waitFor(2);

  // Close emacs
  yield* ide.editor.typeLine(';; Quit: C-x C-c', COLORS.ideComment);
  yield* emacs.keypress('C-x');
  yield* emacs.keypress('C-x C-c');
  yield* emacs.quit();
  yield* ide.console.output(['', '$ _']);
  yield* waitFor(1);

  // Clear editor for init.el content
  ide.editor.clearCode();

  // --- Section 1: inhibit-startup-message ---
  yield* ide.editor.typeLine(';; 1. Disable the startup splash screen', COLORS.ideComment);
  yield* ide.editor.typeLine('(setq inhibit-startup-message t)', COLORS.ideKeyword);
  yield* ide.editor.typeLine('');

  // Show emacs WITHOUT splash — just a blank buffer
  yield* emacs.appear();
  emacs.addLine('');
  emacs.addLine(';; This buffer is for text that is not saved.', EMACS_COMMENT);
  emacs.addLine(';; To create a file, visit it with C-x C-f.', EMACS_COMMENT);
  emacs.setStatus('-U:**-  *scratch*    All L1    (Lisp Interaction)');
  yield* waitFor(2);
  emacs.clearContent();

  // --- Section 2: Package archives (MELPA) ---
  yield* ide.editor.typeLine(';; 2. Setup package manager with MELPA', COLORS.ideComment);
  yield* ide.editor.typeLine("(require 'package)", COLORS.ideKeyword);
  yield* ide.editor.typeLine('(setq package-enable-at-startup nil)');
  yield* ide.editor.typeLine('(add-to-list \'package-archives');
  yield* ide.editor.typeLine('       \'("melpa" . "https://melpa.org/packages/"))', COLORS.ideString);
  yield* ide.editor.typeLine('');
  yield* ide.editor.typeLine('(package-initialize)', COLORS.ideKeyword);
  yield* ide.editor.typeLine('');

  // Show effect: package list
  emacs.clearContent();
  emacs.addLine('Package archives configured:');
  emacs.addLine('  gnu          https://elpa.gnu.org/packages/');
  emacs.addLine('  melpa        https://melpa.org/packages/', '#ffcc00');
  emacs.addLine('');
  emacs.addLine('M-x package-list-packages to browse.');
  emacs.setStatus('-U:**-  *Messages*    All L1    (Messages)');
  yield* waitFor(3);

  // --- Section 3: Bootstrap use-package ---
  yield* ide.editor.typeLine(';; 3. Bootstrap use-package', COLORS.ideComment);
  yield* ide.editor.typeLine("(unless (package-installed-p 'use-package)", COLORS.ideKeyword);
  yield* ide.editor.typeLine('  (package-refresh-contents)');
  yield* ide.editor.typeLine("  (package-install 'use-package))", COLORS.ideKeyword);
  yield* ide.editor.typeLine('');

  // Show effect: installing use-package
  emacs.clearContent();
  emacs.addLine('Contacting host: melpa.org:443');
  emacs.addLine('Refreshing package contents... done');
  emacs.addLine('Installing use-package... done', '#00ff00');
  emacs.addLine('');
  emacs.addLine('use-package: a macro for tidy package config');
  emacs.setStatus('-U:**-  *Messages*    Bot L5    (Messages)');
  yield* waitFor(3);

  // --- Section 4: use-package try ---
  yield* ide.editor.typeLine(';; 4. Try packages without installing permanently', COLORS.ideComment);
  yield* ide.editor.typeLine('(use-package try', COLORS.ideKeyword);
  yield* ide.editor.typeLine('  :ensure t)');
  yield* ide.editor.typeLine('');

  // Show effect
  emacs.clearContent();
  emacs.addLine('Package: try');
  emacs.addLine('');
  emacs.addLine('Try packages without installing them.');
  emacs.addLine('M-x try RET <package-name> RET', '#ffcc00');
  emacs.addLine('');
  emacs.addLine('Temporarily installs & loads a package');
  emacs.addLine('for the current session only.');
  emacs.setStatus('-U:**-  *Help*    All L1    (Help)');
  yield* waitFor(3);

  // --- Section 5: use-package which-key ---
  yield* ide.editor.typeLine(';; 5. Show available keybindings in popup', COLORS.ideComment);
  yield* ide.editor.typeLine('(use-package which-key', COLORS.ideKeyword);
  yield* ide.editor.typeLine('  :ensure t');
  yield* ide.editor.typeLine('  :config');
  yield* ide.editor.typeLine('  (which-key-mode))', COLORS.ideKeyword);

  // Show effect: which-key popup
  emacs.clearContent();
  emacs.addLine('which-key-mode enabled');
  emacs.addLine('');
  emacs.addLine('After pressing C-x, shows available keys:', '#ffffff');
  emacs.addLine('');
  emacs.addLine('  C-x C-f  → find-file');
  emacs.addLine('  C-x C-s  → save-buffer');
  emacs.addLine('  C-x C-c  → save-buffers-kill-terminal');
  emacs.addLine('  C-x b    → switch-to-buffer');
  emacs.addLine('  C-x k    → kill-buffer');
  emacs.addLine('  C-x 2    → split-window-below');
  emacs.addLine('  C-x 3    → split-window-right');
  emacs.setStatus('-U:**-  *scratch*    All L1    (Lisp Interaction)');
  yield* emacs.keypress('C-x');
  yield* waitFor(3);
});

// Helper color for emacs comments
const EMACS_COMMENT = '#ff7f50';
