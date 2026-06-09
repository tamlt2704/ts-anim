import {makeScene2D, Audio, Circle, Rect, Txt} from '@revideo/2d';
import {all, createRef, waitFor, sequence} from '@revideo/core';
import bgMusic from '../audio/bg-music.mp3';

export const introScene = makeScene2D('intro', function* (view) {
  view.fill('#0a0a0a');
  view.add(<Audio src={bgMusic} play={true} volume={0.3} loop={true} />);

  const titleRef = createRef<Txt>();
  const subtitleRef = createRef<Txt>();
  const ballRef = createRef<Circle>();
  const glowRef = createRef<Circle>();
  const trailRefs = Array.from({length: 5}, () => createRef<Circle>());

  // Subtitle
  view.add(
    <Txt
      ref={subtitleRef}
      text={'Master Your Editor'}
      fill={'#888888'} fontFamily={'monospace'} fontSize={28}
      y={60} opacity={0}
    />,
  );

  // Title
  view.add(
    <Txt
      ref={titleRef}
      text={'Emacs Course'}
      fill={'#ffffff'} fontFamily={'monospace'} fontSize={80} fontWeight={700}
      opacity={0} scale={0.5}
    />,
  );

  // Glow behind ball
  view.add(
    <Circle
      ref={glowRef}
      width={120} height={120} fill={'#ff440044'}
      x={-1100} y={0}
    />,
  );

  // Trail particles
  trailRefs.forEach((ref, i) => {
    view.add(
      <Circle
        ref={ref}
        width={20 - i * 3} height={20 - i * 3}
        fill={'#ff6600'} opacity={0}
        x={-1100} y={0}
      />,
    );
  });

  // Ball
  view.add(
    <Circle
      ref={ballRef}
      width={50} height={50} fill={'#ff4444'}
      x={-1100} y={0}
      shadowColor={'#ff0000'} shadowBlur={30}
    />,
  );

  // Title zoom-in entrance
  yield* all(
    titleRef().opacity(1, 0.6),
    titleRef().scale(1, 0.6),
  );
  yield* waitFor(0.3);
  yield* all(
    subtitleRef().opacity(1, 0.4),
    subtitleRef().y(50, 0.4),
  );
  yield* waitFor(0.5);

  // Ball flies in with trail
  yield* all(
    ballRef().x(0, 0.4),
    glowRef().x(0, 0.4),
    ...trailRefs.map((ref, i) => ref().opacity(0.6 - i * 0.1, 0.1)),
    ...trailRefs.map((ref, i) => ref().x(-i * 40, 0.4)),
  );

  // Impact — shake title, flash, scale burst
  yield* all(
    titleRef().fill('#ff4444', 0.05),
    titleRef().scale(1.2, 0.08),
    titleRef().rotation(2, 0.05),
  );
  yield* all(
    titleRef().fill('#ffffff', 0.1),
    titleRef().scale(1, 0.15),
    titleRef().rotation(0, 0.1),
  );

  // Ball + trail exit right
  yield* all(
    ballRef().x(1100, 0.35),
    glowRef().x(1100, 0.35),
    ...trailRefs.map((ref) => ref().x(1100, 0.4)),
    ...trailRefs.map((ref) => ref().opacity(0, 0.3)),
  );

  // Title settles with glow
  yield* titleRef().fill('#44ff88', 0.3);
  yield* waitFor(0.3);
  yield* titleRef().fill('#ffffff', 0.5);

  yield* waitFor(1);

  // Fade out everything
  yield* all(
    titleRef().opacity(0, 0.5),
    subtitleRef().opacity(0, 0.5),
  );
});
