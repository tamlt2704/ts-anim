/**
 * Emacs — a simulated Emacs window for the visualization panel.
 * Uses layout={true} with direction='column' to stack lines.
 */
import {Rect, Txt} from '@revideo/2d';
import {createRef, waitFor} from '@revideo/core';
import {CODE_FONT} from './utils';

const EMACS_BG = '#000000';
const EMACS_FG = '#00ff00';
const EMACS_MENU_BG = '#2e2e2e';
const EMACS_STATUS_BG = '#444444';
const EMACS_STATUS_FG = '#ffffff';
const EMACS_MINIBUF_FG = '#aaaaaa';

export class Emacs {
  private ref = createRef<Rect>();
  private contentRef = createRef<Rect>();
  private statusRef = createRef<Txt>();
  private minibufRef = createRef<Txt>();

  attach(parent: any) {
    parent.add(
      <Rect
        ref={this.ref}
        width={'100%'} height={'100%'}
        fill={EMACS_BG} clip
        layout={true} direction={'column'}
        opacity={0}
      >
        {/* Menu bar */}
        <Rect
          width={'100%'} height={28} fill={EMACS_MENU_BG}
          layout={true} alignItems={'center'} paddingLeft={10} gap={16}
        >
          <Txt text={'File'} fill={EMACS_STATUS_FG} fontFamily={CODE_FONT.family} fontSize={13} />
          <Txt text={'Edit'} fill={EMACS_STATUS_FG} fontFamily={CODE_FONT.family} fontSize={13} />
          <Txt text={'Options'} fill={EMACS_STATUS_FG} fontFamily={CODE_FONT.family} fontSize={13} />
          <Txt text={'Buffers'} fill={EMACS_STATUS_FG} fontFamily={CODE_FONT.family} fontSize={13} />
          <Txt text={'Tools'} fill={EMACS_STATUS_FG} fontFamily={CODE_FONT.family} fontSize={13} />
          <Txt text={'Help'} fill={EMACS_STATUS_FG} fontFamily={CODE_FONT.family} fontSize={13} />
        </Rect>
        {/* Main content — column layout stacks lines vertically */}
        <Rect
          ref={this.contentRef}
          width={'100%'} grow={1}
          fill={EMACS_BG} clip
          layout={true} direction={'column'}
          alignItems={'start'} paddingLeft={12} paddingTop={8}
        />
        {/* Status bar */}
        <Rect
          width={'100%'} height={24} fill={EMACS_STATUS_BG}
          layout={true} alignItems={'center'} paddingLeft={8}
        >
          <Txt
            ref={this.statusRef}
            text={'-U:**-  *scratch*    All L1    (Lisp Interaction)'}
            fill={EMACS_STATUS_FG} fontFamily={CODE_FONT.family} fontSize={12}
          />
        </Rect>
        {/* Minibuffer */}
        <Rect
          width={'100%'} height={22} fill={EMACS_BG}
          layout={true} alignItems={'center'} paddingLeft={8}
        >
          <Txt
            ref={this.minibufRef} text={''}
            fill={EMACS_MINIBUF_FG} fontFamily={CODE_FONT.family} fontSize={12}
          />
        </Rect>
      </Rect>,
    );
  }

  setStatus(text: string) { this.statusRef().text(text); }
  setMinibuffer(text: string) { this.minibufRef().text(text); }

  /** Fade in the emacs window */
  *appear(duration = 0.5) {
    yield* this.ref().opacity(1, duration);
  }

  addLine(text: string, color = EMACS_FG) {
    // Replace spaces/tabs with non-breaking spaces to preserve whitespace
    const preserved = text.replace(/\t/g, '\u00A0\u00A0\u00A0\u00A0').replace(/ /g, '\u00A0');
    this.contentRef().add(
      <Txt
        text={preserved || '\u00A0'}
        fill={color} fontFamily={CODE_FONT.family} fontSize={18}
      />,
    );
  }

  clearContent() {
    const children = this.contentRef().children();
    for (let i = children.length - 1; i >= 0; i--) children[i].remove();
  }

  *showWelcome() {
    this.clearContent();
    this.addLine('');
    this.addLine('Welcome to GNU Emacs, one component of the GNU/Linux operating system.', '#ffffff');
    this.addLine('');
    this.addLine('Emacs Tutorial\t\tLearn basic keystroke commands');
    this.addLine('Emacs Guided Tour\tOverview of Emacs features at gnu.org');
    this.addLine('View Emacs Manual\tView the Emacs manual using Info');
    this.addLine('Absence of Warranty\tGNU Emacs comes with ABSOLUTELY NO WARRANTY');
    this.addLine('Copying Conditions\tConditions for redistributing and changing Emacs');
    this.addLine('Ordering Manuals\tPurchasing printed copies of manuals');
    this.addLine('');
    this.addLine('To start...\tOpen a File\tOpen Home Directory');
    this.addLine('\t\tCustomize Startup\tExplore Packages');
    this.addLine('To quit a partially entered command, type Control-g.');
    this.addLine('');
    this.addLine('This is GNU Emacs 30.1 (build 1, x86_64-pc-linux-gnu, GTK+ Version');
    this.addLine(' 3.24.49, cairo version 1.18.4) of 2025-07-18, modified by Debian');
    this.addLine('Copyright (C) 2025 Free Software Foundation, Inc.');
    this.setStatus('-U:**-  *GNU Emacs*    All L1    (Fundamental)');
    yield* waitFor(1);
  }

  *keypress(keys: string) {
    this.setMinibuffer(keys);
    // Show highlighted key overlay
    const keyRef = createRef<Rect>();
    this.ref().add(
      <Rect
        ref={keyRef}
        width={200} height={50}
        fill={'#ffff0033'} radius={8}
        y={this.ref().height() / 2 - 60}
        opacity={0}
      >
        <Txt
          text={keys} fill={'#ffff00'}
          fontFamily={CODE_FONT.family} fontSize={22} fontWeight={700}
        />
      </Rect>,
    );
    yield* keyRef().opacity(1, 0.2);
    yield* waitFor(0.5);
    yield* keyRef().opacity(0, 0.3);
    keyRef().remove();
  }

  *quit() {
    yield* this.ref().opacity(0, 0.4);
    this.clearContent();
    this.setStatus('');
    this.setMinibuffer('');
  }
}
