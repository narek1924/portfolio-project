// import {
//   Directive,
//   Input,
//   TemplateRef,
//   ViewContainerRef,
//   OnInit,
//   Renderer2,
// } from '@angular/core';
// import {
//   style,
//   animate,
//   AnimationBuilder,
//   AnimationFactory,
//   AnimationPlayer,
// } from '@angular/animations';

// @Directive({ selector: '[animate]' })
// export class AnimateDirective implements OnInit {
//   original: any;
//   copy: any;
//   timing!: string;
//   private player!: AnimationPlayer;

//   @Input() set animate(value: string) {
//     this.timing = value || '150ms ease-in-out';
//   }
//   @Input('animatePos0') pos0: boolean = false;

//   constructor(
//     private templateRef: TemplateRef<any>,
//     private viewContainer: ViewContainerRef,
//     private builder: AnimationBuilder,
//     private renderer: Renderer2
//   ) {}

//   ngOnInit() {
//     this.original = this.viewContainer.createEmbeddedView(
//       this.templateRef
//     ).rootNodes[0];
//     setTimeout(() => {
//       this.copy = this.viewContainer.createEmbeddedView(
//         this.templateRef
//       ).rootNodes[0];
//       this.renderer.setStyle(this.original, 'visibility', 'hidden');
//       const rect = !this.pos0
//         ? { top: this.original.offsetTop, left: this.original.offsetLeft }
//         : { top: 0, left: 0 };
//       this.renderer.setStyle(this.copy, 'position', 'absolute');
//       this.renderer.setStyle(
//         this.copy,
//         'top',
//         rect.top + window.scrollY + 'px'
//       );
//       this.renderer.setStyle(
//         this.copy,
//         'left',
//         rect.left + window.scrollX + 'px'
//       );
//     });
//   }
//   animateGo() {
//     setTimeout(() => {
//       const rect = {
//         top: this.original.offsetTop,
//         left: this.original.offsetLeft,
//       };
//       const myAnimation = this.builder.build([
//         animate(
//           this.timing,
//           style({
//             top: rect.top + window.scrollY,
//             left: rect.left + window.scrollX,
//           })
//         ),
//       ]);
//       this.player = myAnimation.create(this.copy);
//       this.player.play();
//     });
//   }
// }
import {
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  QueryList,
} from '@angular/core';

@Directive({
  selector: '[transition-group-item]',
})
export class TransitionGroupItemDirective {
  prevPos: any;
  newPos: any;
  el: HTMLElement;
  moved!: boolean;
  moveCallback: any;

  constructor(elRef: ElementRef) {
    this.el = elRef.nativeElement;
  }
}

@Component({
  selector: 'app-transition-group',
  template: '<ng-content></ng-content>',
})
export class TransitionGroupComponent {
  @Input() className: any;

  @ContentChildren(TransitionGroupItemDirective)
  items!: QueryList<TransitionGroupItemDirective>;

  ngAfterViewInit() {
    setTimeout(() => this.refreshPosition('prevPos'), 0); // save init positions on next 'tick'

    this.items.changes.subscribe((items) => {
      items.forEach(
        (item: any) => (item.prevPos = item.newPos || item.prevPos)
      );
      items.forEach(this.runCallback);
      this.refreshPosition('newPos');
      items.forEach(
        (item: any) => (item.prevPos = item.prevPos || item.newPos)
      ); // for new items
      const animate = () => {
        items.forEach(this.applyTranslation);
        items.forEach(
          (item: any) => (item['_forceReflow'] = document.body.offsetHeight)
        ); // force reflow to put everything in position
        this.items.forEach(this.runTransition.bind(this));
      };

      const willMoveSome = items.some((item: any) => {
        // const dx = item.prevPos.left !== item.newPos.left;
        const dy = item.prevPos.top !== item.newPos.top;
        return dy;
      });

      if (willMoveSome) {
        console.log('changed');

        animate();
      } else {
        setTimeout(() => {
          // for removed items
          this.refreshPosition('newPos');
          animate();
        }, 0);
      }
    });
  }

  runCallback(item: TransitionGroupItemDirective) {
    if (item.moveCallback) {
      item.moveCallback();
    }
  }

  runTransition(item: TransitionGroupItemDirective) {
    if (!item.moved) {
      return;
    }
    const cssClass = this.className + '-move';
    let el = item.el;
    let style: any = el.style;
    el.classList.add(cssClass);
    style.transform = style.WebkitTransform = style.transitionDuration = '';
    el.addEventListener(
      'transitionend',
      (item.moveCallback = (e: any) => {
        if (!e || /transform$/.test(e.propertyName)) {
          el.removeEventListener('transitionend', item.moveCallback);
          item.moveCallback = null;
          el.classList.remove(cssClass);
        }
      })
    );
  }

  refreshPosition(prop: string) {
    this.items.forEach((item: any) => {
      item[prop] = item.el.getBoundingClientRect();
    });
  }

  applyTranslation(item: TransitionGroupItemDirective) {
    item.moved = false;
    const dx = item.prevPos.left - item.newPos.left;
    const dy = item.prevPos.top - item.newPos.top;
    if (dx || dy) {
      item.moved = true;
      let style: any = item.el.style;
      style.transform = style.WebkitTransform =
        'translate(' + dx + 'px,' + dy + 'px)';
      style.transitionDuration = '0s';
    }
  }
}
