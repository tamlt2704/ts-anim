/**
 * Revideo project entry point.
 * makeProject() bundles scenes and settings into a renderable project.
 */
import {makeProject} from '@revideo/core';
import {emacsScene} from './scenes/emacs';
import {emacsInitScene} from './scenes/emacs-init';
import {introScene} from './scenes/intro';
import {outroScene} from './scenes/outro';

export default makeProject({
  // Array of scenes to render in order
  scenes: [introScene, emacsInitScene, outroScene],
  settings: {
    shared: {
      // Output resolution: 1920x1080 (Full HD)
      size: {x: 1920, y: 1080},
    },
  },
});
