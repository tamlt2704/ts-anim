import {makeScene2D, Rect, Txt} from '@revideo/2d';
import {waitFor} from '@revideo/core';

export const outroScene = makeScene2D('outro', function* (view) {
  view.fill('#181818');

  view.add(
    <Rect width={1920} height={1080} layout={true} direction={'column'} alignItems={'center'} justifyContent={'center'} gap={30}>
      <Txt text={'Thanks for watching!'} fill={'#ffffff'} fontFamily={'monospace'} fontSize={48} fontWeight={700} />
      <Txt text={'Like & Subscribe for more Emacs tutorials'} fill={'#aaaaaa'} fontFamily={'monospace'} fontSize={24} />
    </Rect>,
  );

  yield* waitFor(3);
});
