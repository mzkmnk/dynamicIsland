import {
  Component,
  ElementRef,
  signal,
  AfterViewInit,
  WritableSignal, effect, viewChild,
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
  styleUrls   : [ 'home.page.scss' ],
  standalone  : true,
  imports     : [
    IonHeader, IonToolbar, IonTitle, IonContent
  ],
})
export class HomePageComponent implements AfterViewInit {
  $dynamicIslandIsOpen: WritableSignal<boolean> = signal<boolean>(false);

  dynamicIsland$ = viewChild<ElementRef>('dynamicIsland')

  private styler?           : Styler;
  // eslint-disable-next-line
  private defaultDimensions : any; // todo 型定義

  constructor() {
    effect(() => ((isOpen:boolean):void => {
      if(isOpen){
        this.openDynamicIsland()
      }else{
        this.closeDynamicIsland()
      }
    })(this.$dynamicIslandIsOpen()))
  }

  ngAfterViewInit(): void {
    this.styler = styler(this.dynamicIsland$()?.nativeElement);
    this.defaultDimensions = {
      borderRadius : this.styler.get('borderRadius'),
      width        : this.styler.get('width'),
      height       : this.styler.get('height'),
    };
  }

  onClickDynamicIsland(): void {
    this.$dynamicIslandIsOpen.update((value) => !value);
  }

  openDynamicIsland(): void {
    PopMotionAnimation({
      from : JSON.stringify(this.defaultDimensions),
      to   : JSON.stringify({
        borderRadius : 25,
        width        : 350,
        height       : 100,
      }),
      duration : 250,
      type     : 'spring',
      onUpdate : (latest: string): void => this.getStyle(latest),
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
      duration : 250,
      type     : 'spring',
      onUpdate : (latest: string): void => this.getStyle(latest),
    });
  }

  getStyle = (latest: string): void => {
    const parsedJSON = JSON.parse(latest);
    const [
      borderRadius, width, height
    ] = [
      parsedJSON.borderRadius,
      parsedJSON.width,
      parsedJSON.height,
    ];
    this.styler?.set('borderRadius', `${borderRadius}px`);
    this.styler?.set('width', `${width}px`);
    this.styler?.set('height', `${height}px`);
  };
}
