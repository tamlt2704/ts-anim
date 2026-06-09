/**
 * Emacs scene — interactive coding on the left, Emacs simulation on the right.
 */
import {makeScene2D} from '@revideo/2d';
import {waitFor} from '@revideo/core';
import {IDE} from '../ide';
import {Emacs} from '../emacs';
import {COLORS} from '../utils';

export const emacsScene = makeScene2D('emacs', function* (view) {
  const ide = new IDE(view);

  // Populate the explorer sidebar
  ide.explorer.addFolder('src');
  ide.explorer.addFile('run_emacs.sh', 1, true);

  // Set editor file tab
  ide.editor.setFile('run_emacs.sh');

  // Create Emacs in the visualization panel
  const emacs = new Emacs();
  emacs.attach(ide.vizRef());

  // Interactive coding — type the script line by line
  yield* ide.editor.typeLine('#!/bin/bash', COLORS.ideComment);
  yield* ide.editor.typeLine('# Start emacs and quit', COLORS.ideComment);
  yield* ide.editor.typeLine('');
  yield* ide.editor.typeLine('emacs', COLORS.ideKeyword);

  // After typing the command, execute it in terminal
  yield* waitFor(0.5);
  yield* ide.console.type('emacs');

  // Emacs appears in the visualization with fade-in
  yield* emacs.appear();
  yield* emacs.showWelcome();

  // Show keypresses and quit
  yield* ide.editor.typeLine('# Then press C-x C-c to quit', COLORS.ideComment);
  yield* emacs.keypress('C-x');
  yield* emacs.keypress('C-x C-c');
  yield* emacs.quit();

  yield* ide.console.output(['', '$ _']);
  yield* waitFor(2);
});
