import {
  Component,
  ElementRef,
  signal,
  ViewChild,
  AfterViewInit,
  WritableSignal,
} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import styler, { Styler } from 'stylefire';
import { animate as PopMotionAnimation } from 'popmotion';

@Component({
  selector    : 'app-home',
  templateUrl : 'home.page.html',
  styleUrls   : [
    'home.page.scss' 
  ],
  standalone : true,
  imports    : [
    IonHeader, IonToolbar, IonTitle, IonContent 
  ],
})
export class HomePage implements AfterViewInit {
  $dynamicIslandIsOpen: WritableSignal<boolean> = signal<boolean>(false);

  @ViewChild('dynamicIsland') dynamicIsland?: ElementRef;

  private styler?           : Styler;
  private defaultDimensions : any;

  ngAfterViewInit(): void {
    this.styler = styler(this.dynamicIsland?.nativeElement);
    this.defaultDimensions = {
      borderRadius : this.styler.get('borderRadius'),
      width        : this.styler.get('width'),
      height       : this.styler.get('height'),
    };
  }

  onClickDynamicIsland(): void {
    this.$dynamicIslandIsOpen.update((value) => !value);
    this.$dynamicIslandIsOpen()
      ? this.openDynamicIsland()
      : this.closeDynamicIsland();
  }

  openDynamicIsland(): void {
    PopMotionAnimation({
      from : JSON.stringify(this.defaultDimensions),
      to   : JSON.stringify({ borderRadius : 25,
        width        : 400,
        height       : 150 }),
      duration : 400,
      type     : 'spring',
      onUpdate : (latest) => {
        const latestFormatted = JSON.parse(latest);
        this.styler?.set('borderRadius', `${latestFormatted.borderRadius}px`);
        this.styler?.set('width', `${latestFormatted.width}px`);
        this.styler?.set('height', `${latestFormatted.height}px`);
      },
    });
  }

  closeDynamicIsland(): void {
    PopMotionAnimation({
      from: JSON.stringify({
        borderRadius : this.styler?.get('borderRadius'),
        width        : this.styler?.get('width'),
        height       : this.styler?.get('height'),
      }),
      to       : JSON.stringify(this.defaultDimensions),
      duration : 400,
      type     : 'spring',
      onUpdate : (latest: string): void => {
        const latestFormatted = JSON.parse(latest);
        this.styler?.set('borderRadius', `${latestFormatted.borderRadius}px`);
        this.styler?.set('width', `${latestFormatted.width}px`);
        this.styler?.set('height', `${latestFormatted.height}px`);
      },
    });
  }
}
