import {
  Component,
  Input,
  NgZone,
  ChangeDetectorRef,
  ElementRef,
  Renderer
}                          from '@angular/core';
import {
  QueueService,
  QUEUE_ITEM_ERROR,
  QUEUE_ITEM_PROGRESS,
  QUEUE_ITEM_COMPLETE,
  QUEUE_COMPLETE
}                          from './queue.service';
import { EmitterService }  from '../shared/service/emitter.service';
import {
  IPlaylistItem,
  IThumbnailItem,
  IConversionItem
}                          from '../shared/types';
import { Subscription }    from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

@Component({
  selector: 'cheap-thrills-queue-item',
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
  private timerSub          : Subscription;
  private reveal            : boolean;
  private expand            : boolean;

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
  }

  updateOptions(property: any) {
    this.options = Object.assign({}, this.options, property);
    // console.log('queue-item.ts: updateOptions: property:', property, this.options);
  }

  getTransitionDelay(): number {
    const ind: number = this.queueItem.position;
    return 200 * ind;
  }

  // just demonstrative for style assignment to template element
  getTransitionDelayString(): string {
    // return this.getTransitionDelay() / 1000 + 's';
    return '0s';
  }

  onClickExpandToggle(e: MouseEvent) {
    // toggle property to expand/collapse with selector
    this.expand = !this.expand;
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
    const del: number = this.getTransitionDelay();
    const timer = TimerObservable.create(del);
    this.timerSub = timer.subscribe( (t: number) => {
      this.reveal = true;
      this.timerSub.unsubscribe();
    });

    // listen for mp3 conversion
    // hook up to progress and completion events
    EmitterService
    .get(QUEUE_ITEM_ERROR + '_' + this.queueItem.position)
    .subscribe( (error: any) => {
      console.log('queue-item.ts: conversion error: error:', error);
      // display conversion error
      this.errorMsg = error.message;
    });

    EmitterService
    .get(QUEUE_ITEM_PROGRESS + '_' + this.queueItem.position)
    .subscribe( (progressData: any) => {
      // display progress
      // - guessing I have to do this due to how zones partition execution?
      // this.zone.run(() => this.progress = Math.floor(progressData.percentage) );

      this.progress = Math.floor(progressData.percentage);
      this.changeRef.detectChanges();
    });

    EmitterService
    .get(QUEUE_ITEM_COMPLETE + '_' + this.queueItem.position)
    .subscribe( (conversionData: IConversionItem) => {
      console.log('queue-item.ts: conversion complete: conversionData:', conversionData);
      this.errorMsg = '';
      this.conversionData = conversionData;
      this.conversionComplete = true;
      // this.conversionData.link = decodeURIComponent(this.conversionData.link);

      this.changeRef.detectChanges();
    });
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
  }

  ngAfterViewChecked() {
    // Component views have been checked
  }

  ngOnDestroy() {
    // Speak now or forever hold your peace
    this.timerSub.unsubscribe();
  }

}
