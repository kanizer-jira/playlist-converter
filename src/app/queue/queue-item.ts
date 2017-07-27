import {
  Component,
  Input,
  NgZone,
  ChangeDetectorRef,
  ElementRef,
  Renderer
}                          from '@angular/core';
import { Subscription }    from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import {
  QueueService,
  QUEUE_ITEM_ERROR,
  QUEUE_ITEM_INITIATE_CONVERSION,
  QUEUE_ITEM_PROGRESS,
  QUEUE_ITEM_COMPLETE,
  QUEUE_ITEM_CANCEL,
  QUEUE_COMPLETE
}                          from './queue.service';
import {
  IPlaylistItem,
  IThumbnailItem,
  IConversionItem
}                          from '../shared/types';
import { EmitterService }  from '../shared/service/emitter.service';
import { ViewportUtil }    from '../shared/viewport-util';

@Component({
  selector: 'cheapthrills-queue-item',
  template: require('./queue-item.html')
})
export class QueueItemComponent {
  @Input()
  public queueItem          : IPlaylistItem;
  public thumbnail          : IThumbnailItem;
  public conversionData     : IConversionItem;
  public autoTitle          : string;
  public autoArtist         : string;
  public progress           : number;
  public conversionComplete : boolean;
  public errorMsg           : string = '';
  public options            : any = {};
  private subError          : Subscription;
  private subInit           : Subscription;
  private subProgress       : Subscription;
  private subComplete       : Subscription;
  private subCancel         : Subscription;
  private timerSub          : Subscription;
  private reveal            : boolean;
  private expand            : boolean;
  private active            : boolean;
  private collapseHeight    : number;
  private expandHeight      : number;
  private displayHeight     : number;
  private currentBreakpoint : string;
  private drawerElem        : any; // TODO - type to correct DOM Element type
  private viewportUtil      : ViewportUtil;

  constructor(
    public zone: NgZone,
    public changeRef: ChangeDetectorRef,
    private queueService: QueueService,
    public el: ElementRef,
    public renderer: Renderer
  ) {
    // // examples of element reference
    // // el.nativeElement.style.backgroundColor = 'yellow';
    // renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'yellow');

    // TODO - move into parent
    this.viewportUtil = ViewportUtil.gi();
    this.viewportUtil.subscribe( (type: any) => {
      // console.log('queue-item.ts: viewport event: type:', type);
      this.onBreakpointChange(type);
    });
  }

  attachSubscribers() {
    // listen for mp3 conversion
    // hook up to progress and completion events
    this.subError = EmitterService
    .get(QUEUE_ITEM_ERROR + '_' + this.queueItem.position)
    .subscribe( (error: any) => {
      console.log('queue-item.ts: conversion error: error:', error);
      // display conversion error
      this.errorMsg = error.message;
    });

    this.subInit = EmitterService
    .get(QUEUE_ITEM_INITIATE_CONVERSION)
    .subscribe( (index: number) => {
      this.active = this.queueItem.position === index;
    });

    this.subProgress = EmitterService
    .get(QUEUE_ITEM_PROGRESS)
    .subscribe( (progressData: any) => {
      // hacks if not updating how zones partition execution?
      // this.zone.run(() => this.progress = Math.floor(progressData.percentage) );

      // display progress as width style property
      if(this.queueItem.position === progressData.ind) {
        this.progress = Math.floor(progressData.obj.percentage * 100);
        this.changeRef.detectChanges();
      }
    });

    this.subComplete = EmitterService
    .get(QUEUE_ITEM_COMPLETE + '_' + this.queueItem.position)
    .subscribe( (conversionData: IConversionItem) => {
      // console.log('queue-item.ts: conversion complete: conversionData:', conversionData);
      this.errorMsg = '';
      this.conversionData = conversionData;
      this.conversionComplete = true;
      this.active = false;
      // this.conversionData.link = decodeURIComponent(this.conversionData.link);

      this.changeRef.detectChanges();
    });

    this.subCancel = EmitterService
    .get(QUEUE_ITEM_CANCEL + '_' + this.queueItem.position)
    .subscribe( () => {
      this.errorMsg = '';
      this.progress = 0;
      this.conversionComplete = false;
      this.active = false;
      this.changeRef.detectChanges();
    });
  }

  detachSubscribers() {
    this.timerSub.unsubscribe();
    this.subProgress.unsubscribe();
    this.subInit.unsubscribe();
    this.subError.unsubscribe();
    this.subComplete.unsubscribe();
    this.subCancel.unsubscribe();
  }

  updateOptions(property: any) {
    this.options = Object.assign({}, this.options, property);
    // console.log('queue-item.ts: updateOptions: property:', property, this.options);
  }

  // getTransitionDelay(): number {
  //   const ind: number = this.queueItem.position;
  //   return 200 * ind;
  // }

  // just demonstrative for style assignment to template element
  getTransitionDelayString(): string {
    // return this.getTransitionDelay() / 1000 + 's';
    return '0s';
  }

  getDrawerHeight() {
    return this.drawerElem.offsetHeight;
  }

  onClickExpandToggle(e: MouseEvent) {
    // toggle property to expand/collapse with selector
    this.expand = !this.expand;
    this.displayHeight = this.expand
    ? this.collapseHeight + this.expandHeight
    : this.collapseHeight;
  }

  onThumbnailClick(e: MouseEvent) {
    // TODO - toggle checkbox
  }

  // TODO - externalize/generalize
  onBreakpointChange(e: any) {
    this.currentBreakpoint = e.viewport || this.currentBreakpoint; // account for retina object

    // store for later
    const scrollPosition = window.pageYOffset || (document.documentElement || document.body).scrollTop;
    const windowHeight = document.documentElement.clientHeight || window.innerHeight;

    // collapse drawer
    if(this.expand) {
      this.expand = false;
      this.displayHeight = this.collapseHeight;
    }

    // update expansion height
    this.expandHeight = this.getDrawerHeight();
  }


  // ----------------------------------------------------------------------
  //
  // ng2 lifecycle - in sequence
  //
  // ----------------------------------------------------------------------

  ngOnChanges(changes: any) {
    // Called right after our bindings have been checked but only
    // if one of our bindings has changed.
  }

  ngOnInit() {
    // setup thumbnail
    this.thumbnail = this.queueItem.thumbnails.default;
    this.progress = 0;

    if(this.queueItem.title.indexOf('-') > -1) {
      const temp = this.queueItem.title.split('-');
      if(temp.length >= 2) {
        this.autoArtist = temp[0].trim();
        this.autoTitle = temp[1].trim();
      }
    } else {
      this.autoArtist = 'unknown';
      this.autoTitle = this.queueItem.title;
    }

    // animate in and reveal
    // superceded by sequential construction of queue item array,
    // but still using delay to allow for fade in
    // const del: number = this.getTransitionDelay();
    const del: number = 10;
    const timer = TimerObservable.create(del);
    this.timerSub = timer.subscribe( (t: number) => {
      this.reveal = true;
      this.timerSub.unsubscribe();
    });

    this.attachSubscribers();
  }

  ngDoCheck() {
    // Custom change detection
  }

  ngAfterContentInit() {
    // Component content has been initialized
  }

  ngAfterContentChecked() {
    // Component content has been Checked
  }

  ngAfterViewInit() {
    // Component views are initialized
    this.drawerElem = this.el.nativeElement.querySelector('.drawer');

    // update expansion height
    this.collapseHeight = this.el.nativeElement.querySelector('.queue-item-contents').offsetHeight;
    this.expandHeight = this.getDrawerHeight();
  }

  ngAfterViewChecked() {
    // Component views have been checked
  }

  ngOnDestroy() {
    // Speak now or forever hold your peace
    this.detachSubscribers();
  }

}
