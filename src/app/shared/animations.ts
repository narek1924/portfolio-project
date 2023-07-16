import {
  trigger,
  transition,
  query,
  style,
  animate,
  keyframes,
  stagger,
  state,
  animateChild,
  group,
} from '@angular/animations';

export const decorationAnimation = trigger('decorationAnimation', [
  transition(':leave', animate(400, style({ opacity: 0 }))),
  transition(':enter', [
    style({ opacity: 0 }),
    animate(
      400,
      style({
        opacity: '*',
      })
    ),
  ]),
]);
export const itemAnimation = trigger('item', [
  transition(
    ':leave',
    animate(
      150,
      keyframes([
        style({ visibility: 'hidden', offset: 0 }),
        style({ height: '0', paddingTop: 0, paddingBottom: 0, offset: 1 }),
      ])
    )
  ),
  transition(':enter', [
    style({ height: 0, paddingTop: 0, paddingBottom: 0 }),
    animate(
      150,
      style({
        height: '*',
        paddingTop: '*',
        paddingBottom: '*',
      })
    ),
  ]),
]);
export const settingsIconAnimation = trigger('settings', [
  transition(
    ':leave',
    animate(
      '310ms',
      keyframes([
        style({ visibility: 'visible', offset: 0.99 }),
        style({ visibility: 'hidden', offset: 1 }),
      ])
    )
  ),
]);
export const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter', style({ transform: 'translateY(50px)', opacity: 0 }), {
      optional: true,
    }),
    query(
      ':enter',
      stagger(
        '70ms',
        animate(
          '200ms ease-in',
          style({ transform: 'translateY(0px)', opacity: 1 })
        )
      ),
      { optional: true }
    ),
  ]),
]);
export const openCloseAnimation = trigger('openClose', [
  state(
    'open',
    style({
      marginLeft: '10px',
    })
  ),
  state(
    'close',
    style({
      marginLeft: '100px',
    })
  ),
  transition('open <=> close', [animate('100ms')]),
]);
export const taskInfoAnimation = trigger('taskInfo', [
  state(
    'open',
    style({
      left: '100px',
    })
  ),
  state(
    'close',
    style({
      left: '250px',
    })
  ),
  transition('open <=> close', [animate('207ms linear')]),
]);
export const firstElementAnimation = trigger('first-one', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(30px)' }),
    animate(
      '200ms ease-in',
      style({
        opacity: '1',
        transform: 'translateY(0px)',
      })
    ),
  ]),
]);
export const secondElementAnimation = trigger('second-one', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(30px)' }),
    animate(
      '200ms 70ms ease-in',
      style({
        opacity: '1',
        transform: 'translateY(0px)',
      })
    ),
  ]),
  transition(':leave', [
    animate(
      200,
      style({
        opacity: 0,
        transform: 'translateY(-50px)',
      })
    ),
  ]),
]);
export const taskDone = trigger('taskDoneList', [
  state(
    'unDone',
    style({
      opacity: '1',
    })
  ),
  state(
    'done',
    style({
      opacity: '0',
    })
  ),
  transition('unDone <=> done', [animate('150ms')]),
]);
export const arrowAnimation = trigger('arrowAnimation', [
  transition(
    ':leave',
    animate(
      150,
      style({
        transform: 'translateY(-30px)',
        opacity: 0,
      })
    )
  ),
  transition(':enter', [
    style({ transform: 'translateY(20px)', opacity: 0 }),
    animate(
      150,
      style({
        transform: 'translateY(0)',
        opacity: 1,
      })
    ),
  ]),
]);
export const quickAddButtons = trigger('buttonsAnimation', [
  transition(
    ':leave',
    animate(
      150,
      style({
        height: 0,
      })
    )
  ),
  transition(':enter', [
    style({ height: 0 }),
    animate(
      150,
      style({
        height: '40px',
      })
    ),
  ]),
]);
export const tasksWrapperAnimation = trigger('wrapper', [
  transition(':leave', animate(150, style({ height: 0 }))),
  transition(':enter', [
    style({ height: 0 }),
    animate(
      150,
      style({
        height: '*',
      })
    ),
  ]),
]);
export const listsWrapperAnimation = trigger('wrapper', [
  transition(
    ':leave',
    animate(
      '300ms ease-out',
      keyframes([
        style({ flex: '1', overflow: 'hidden', offset: 0 }),
        style({ flex: '0', overflow: 'hidden', offset: 0.9 }),
        // style({ height: '0', paddingTop: 0, paddingBottom: 0, offset: 1 }),
      ])
    )
  ),
  transition(':enter', [
    style({ flex: 0, overflow: 'hidden' }),
    animate(
      '400ms ease-in-out',
      style({
        flex: '*',
        overflow: 'hidden',
      })
    ),
  ]),
]);
export const firstStepAnimation = trigger('firstStepAnimation', [
  transition(
    ':leave',
    animate(200, style({ transform: 'translateX(-100px)', opacity: 0 }))
  ),
  transition(':enter', [
    style({ transform: 'translateX(-100px)', opacity: 0 }),
    animate(
      200,
      style({
        transform: 'translateX(0px)',
        opacity: 1,
      })
    ),
  ]),
]);
export const nextStepAnimation = trigger('nextStepAnimation', [
  // transition(
  //   ':leave',
  //   animate(200, style({ transform: 'translateX(100px)', opacity: 0 }))
  // ),
  transition(':enter', [
    style({ transform: 'translateX(100px)', opacity: 0 }),
    animate(
      200,
      style({
        transform: 'translateX(0px)',
        opacity: 1,
      })
    ),
  ]),
]);
export const opacityAnimation = trigger('opacity', [
  transition(
    ':leave',
    animate(
      150,
      style({
        opacity: 0,
      })
    )
  ),
  transition(':enter', [
    style({ opacity: 0 }),
    animate(
      150,
      style({
        opacity: '*',
      })
    ),
  ]),
]);
export const fadeInAnimation = trigger('fadeIn', [
  transition(':enter', [
    group([
      query(':self', [
        style({ backgroundColor: '#fff' }),
        animate(
          300,
          style({
            backgroundColor: 'initial',
          })
        ),
      ]),
      query('@*', animateChild(), { optional: true }),
    ]),

    // query('@*', [animateChild(group)], { optional: true }),
  ]),
]);
