/**
 * IDE class — VS Code-style IDE on the left, visualization area on the right.
 * Uses Revideo's Layout (flexbox) for panel arrangement.
 */
import {Layout, Rect, Txt} from '@revideo/2d';
import {createRef, waitFor} from '@revideo/core';
import {COLORS, CODE_FONT} from './utils';

/** Explorer panel — file tree sidebar */
export class Explorer {
  private ref = createRef<Rect>();

  attach(parent: any) {
    parent.add(
      <Rect
        ref={this.ref}
        width={180} height={'100%'}
        fill={COLORS.ideSidebar} clip
        direction={'column'} layout={true} padding={8} gap={4}
      >
        <Txt
          text={'EXPLORER'}
          fill={'#bbbbbb'} fontFamily={CODE_FONT.family}
          fontSize={14} fontWeight={700} marginBottom={6}
        />
      </Rect>,
    );
  }

  addFile(name: string, indent = 0, active = false) {
    const props: any = {
      width: '100%', height: 22,
      radius: 3, layout: true, alignItems: 'center', paddingLeft: 6 + indent * 12,
    };
    if (active) props.fill = '#37373d';
    const node = <Rect {...props}>
      <Txt
        text={name} fill={active ? '#ffffff' : COLORS.ideText}
        fontFamily={CODE_FONT.family} fontSize={16}
      />
    </Rect>;
    this.ref().add(node);
  }

  addFolder(name: string, indent = 0) {
    this.ref().add(
      <Rect
        width={'100%'} height={22}
        layout={true} alignItems={'center'} paddingLeft={6 + indent * 12}
      >
        <Txt
          text={`▾ ${name}`} fill={'#cccccc'}
          fontFamily={CODE_FONT.family} fontSize={16} fontWeight={700}
        />
      </Rect>,
    );
  }
}

/** Console panel — terminal at the bottom of the IDE */
export class Console {
  private ref = createRef<Rect>();
  private row = 0;

  attach(parent: any) {
    parent.add(
      <Rect
        ref={this.ref}
        width={'100%'} height={200}
        fill={COLORS.termBg} clip
        direction={'column'} layout={true} padding={0}
      >
        <Rect
          width={'100%'} height={28} fill={'#333333'}
          layout={true} alignItems={'center'} paddingLeft={10}
        >
          <Txt
            text={'TERMINAL'} fill={'#bbbbbb'}
            fontFamily={CODE_FONT.family} fontSize={14} fontWeight={700}
          />
        </Rect>
      </Rect>,
    );
  }

  *type(command: string) {
    this.addLine(`$ ${command}`);
    yield* waitFor(1);
  }

  *output(lines: string[]) {
    for (const line of lines) this.addLine(line);
    yield* waitFor(1.5);
  }

  *clear() {
    const children = this.ref().children();
    for (let i = children.length - 1; i >= 1; i--) children[i].remove();
    this.row = 0;
    yield* waitFor(0.3);
  }

  private addLine(text: string) {
    this.ref().add(
      <Txt
        x={-this.ref().width() / 2 + 16}
        y={-this.ref().height() / 2 + 42 + this.row * 24}
        text={text} fill={COLORS.termText}
        fontFamily={CODE_FONT.family} fontSize={22}
      />,
    );
    this.row++;
  }
}

/** Editor panel — code area with tab bar and line numbers */
export class Editor {
  private ref = createRef<Rect>();

  attach(parent: any) {
    parent.add(
      <Rect
        ref={this.ref}
        grow={1} height={'100%'}
        fill={COLORS.ideBg} clip
        direction={'column'} layout={true} padding={0}
      >
        <Rect
          width={'100%'} height={28} fill={COLORS.ideTabBar}
          layout={true} alignItems={'center'} paddingLeft={10}
        />
      </Rect>,
    );
  }

  setFile(name: string) {
    const tabBar = this.ref().children()[0] as Rect;
    tabBar.add(
      <Rect
        height={28} fill={COLORS.ideBg}
        layout={true} alignItems={'center'} paddingLeft={10} paddingRight={10}
      >
        <Txt
          text={name} fill={COLORS.ideText}
          fontFamily={CODE_FONT.family} fontSize={16}
        />
      </Rect>,
    );
  }

  private lineCount = 0;

  setCode(lines: {text: string; color?: string}[]) {
    for (let i = 0; i < lines.length; i++) {
      this.ref().add(
        <Rect width={'100%'} layout={true} direction={'row'} alignItems={'center'} gap={8} paddingLeft={8}>
          <Txt
            text={`${i + 1}`} fill={COLORS.ideLineNum}
            fontFamily={CODE_FONT.family} fontSize={22} width={30}
          />
          <Txt
            text={lines[i].text || ' '} fill={lines[i].color || COLORS.ideText}
            fontFamily={CODE_FONT.family} fontSize={22}
          />
        </Rect>,
      );
    }
    this.lineCount = lines.length;
  }

  /** Animate typing a line character by character */
  *typeLine(text: string, color?: string, charDelay = 0.05) {
    const txtRef = createRef<Txt>();
    this.ref().add(
      <Rect width={'100%'} layout={true} direction={'row'} alignItems={'center'} gap={8} paddingLeft={8}>
        <Txt
          text={`${this.lineCount + 1}`} fill={COLORS.ideLineNum}
          fontFamily={CODE_FONT.family} fontSize={22} width={30}
        />
        <Txt
          ref={txtRef}
          text={''} fill={color || COLORS.ideText}
          fontFamily={CODE_FONT.family} fontSize={22}
        />
      </Rect>,
    );

    for (let i = 0; i <= text.length; i++) {
      txtRef().text(text.slice(0, i) || ' ');
      yield* waitFor(charDelay);
    }

    this.lineCount++;
  }

  /** Animate typing multiple lines */
  *typeCode(lines: {text: string; color?: string}[], charDelay = 0.04) {
    for (const line of lines) {
      yield* this.typeLine(line.text, line.color, charDelay);
    }
  }

  /** Clear all code content (keeps tab bar) */
  clearCode() {
    const children = this.ref().children();
    for (let i = children.length - 1; i >= 1; i--) children[i].remove();
    this.lineCount = 0;
  }
}

/**
 * IDE — left half is the IDE (Explorer + Editor + Console),
 * right half is a visualization area you can add nodes to.
 *
 * Structure:
 *   ┌────────────────────┬─────────────────────────┐
 *   │  IDE (left half)   │  Visualization (right)  │
 *   │ ┌──────┬─────────┐ │                         │
 *   │ │Explr │ Editor  │ │                         │
 *   │ │      │         │ │                         │
 *   │ │      ├─────────┤ │                         │
 *   │ │      │ Console │ │                         │
 *   │ └──────┴─────────┘ │                         │
 *   └────────────────────┴─────────────────────────┘
 */
export class IDE {
  public explorer = new Explorer();
  public editor = new Editor();
  public console = new Console();
  /** The right-hand visualization area — add your nodes here */
  public vizRef = createRef<Rect>();

  private rootRef = createRef<Layout>();
  private ideColRef = createRef<Layout>();

  constructor(view: any) {
    view.fill('#181818');

    view.add(
      <Layout
        ref={this.rootRef}
        layout={true} direction={'row'}
        width={1900} height={1000}
        gap={2}
      >
        {/* Left: IDE */}
        <Layout
          layout={true} direction={'row'}
          width={'50%'} height={'100%'} gap={1}
        >
          <Rect width={180} height={'100%'} />
          <Layout
            ref={this.ideColRef}
            layout={true} direction={'column'}
            grow={1} height={'100%'} gap={1}
          />
        </Layout>
        {/* Right: Visualization */}
        <Rect
          ref={this.vizRef}
          width={900} shrink={0} height={'100%'}
          fill={'#111111'} radius={4} clip
        />
      </Layout>,
    );

    const explorerSlot = (this.rootRef().children()[0] as Layout).children()[0];
    this.explorer.attach(explorerSlot);
    this.editor.attach(this.ideColRef());
    this.console.attach(this.ideColRef());
  }
}
