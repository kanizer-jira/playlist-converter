import {
  Component,
  Input,
  ElementRef,
}                          from '@angular/core';
import { Subscription }    from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import {
  QueueService,
  QUEUE_ITEM_PROGRESS,
  QUEUE_COMPLETE,
  QUEUE_ERROR
}                          from '../queue/queue.service';
import {
  IRingProgressItem
}                          from '../shared/types';
import { EmitterService }  from '../shared/service/emitter.service';


@Component({
  selector: 'cheap-thrills-button-ring',
  template: require('./button-ring.html')
})
export class BigButtonRingComponent {
  public ringEl: any; // elem
  public ringLen: number;
  public segmentLen: number;
  public segmentIndex: number;
  public segmentRotation: string;
  public segmentColor: string = 'blue';
  public segmentWidth: string;

  @Input()
  private ringItem: IRingProgressItem;

  constructor(
    public el: ElementRef,
    private queueService: QueueService
  ) {}

  attachSubscribers() {

    // TODO - state should transform button label and color, not overlapping buttons

    EmitterService
    .get(QUEUE_ITEM_PROGRESS)
    .subscribe( (progressData: any) => {

      // TODO - calculate relative lengths of songs / total percentage
      var len: number = this.queueService.consolidatedData.items.length;
      console.log('button.ts: len:', len);

      if(progressData.ind === this.segmentIndex) {
        this.updateRingProgress( progressData.obj.percentage );
        // this.changeRef.detectChanges();
      }
    });

    // EmitterService.get(QUEUE_COMPLETE)
    // .subscribe( (res: IArchiveItem) => {
    //   console.log('queue.ts: conversion queue complete: res:', res);
    //   // activate download button
    //   this.queueComplete = true;
    //   this.downloadPath = res.downloadPath;
    // });

    // EmitterService.get(QUEUE_ERROR)
    // .subscribe( (msg: string) => {
    //   console.log('queue.ts: conversion queue error: msg:', msg);
    //   // TODO - display error
    // });
  }

  initRingStyles() {
    const totalSegments: number = this.queueService.consolidatedData.items.length;
    this.segmentIndex = this.ringItem.index;

    // define svn element
    this.ringEl = this.el.nativeElement.querySelector('circle');
    this.ringLen = this.ringEl.getTotalLength();
    this.segmentLen = this.ringLen * ( 1 / totalSegments );

    // assign rotation and percentage to reveal
    const rotation: number = ( ( this.segmentIndex / totalSegments ) * 360 ) - 90;
    this.segmentRotation = "rotate(" + rotation + " 25 25)";

    // alternate color
    // this.segmentColor = "#" + ( ( 1 << 24 ) * Math.random() | 0 ).toString(16);
    // constrained to hue
    this.segmentColor = "rgba(255, " + Math.round(Math.random() * 255) + ", " + Math.round(Math.random() * 255) + ", " + Math.max(Math.random(), 1) + ")";

    // Set up the starting positions
    this.ringEl.style.strokeDasharray = this.ringLen + ' ' + this.ringLen;
    this.ringEl.style.strokeDashoffset = this.ringLen;

    // Trigger a layout so styles are calculated & the browser
    // picks up the starting position before animating
    this.ringEl.getBoundingClientRect();
  }

  updateRingProgress(percent: number) {
    // convert percent to offset
    this.segmentWidth = Math.ceil(percent * 4) + '';
    this.ringEl.style.strokeDashoffset = this.ringLen - ( percent * this.segmentLen ) + '';
  }


  // ----------------------------------------------------------------------
  //
  // ng2 lifecycle - in sequence
  //
  // ----------------------------------------------------------------------

  ngOnInit() {
    this.attachSubscribers();
    this.initRingStyles();
  }

}
