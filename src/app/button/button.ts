import {
  Component,
  // Input,
  Output,
  // NgZone,
  // ChangeDetectorRef,
  // ElementRef,
  // Renderer,
  EventEmitter
}                          from '@angular/core';
// import { Subscription }    from 'rxjs';
// import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { BigButtonRingComponent } from './button-ring';
import {
  QueueService,
  // QUEUE_ITEM_ERROR,
  // QUEUE_ITEM_INITIATE_CONVERSION,
  // QUEUE_ITEM_PROGRESS,
  // QUEUE_ITEM_COMPLETE,
  // QUEUE_COMPLETE,
  // QUEUE_ERROR
}                          from '../queue/queue.service';
import {
  // IPlaylistItem,
  // IThumbnailItem,
  // IConversionItem,
  IRingProgressItem
}                          from '../shared/types';
// import { EmitterService }  from '../shared/service/emitter.service';


@Component({
  selector: 'cheap-thrills-button',
  template: require('./button.html')
})
export class BigButtonComponent {
  @Output()
  private notifyConvert: EventEmitter<null> = new EventEmitter<null>();
  private ringArray: IRingProgressItem[];

  constructor(
    // public el: ElementRef,
    private queueService: QueueService
  ) {}

  // attachSubscribers() {

    // TODO - state should transform button label and color, not overlapping buttons

    // EmitterService
    // .get(QUEUE_ITEM_PROGRESS)
    // .subscribe( (progressData: any) => {

    //   // TODO - calculate relative lengths of songs / total percentage
    //   var len: number = this.queueService.consolidatedData.items.length;
    //   console.log('button.ts: len:', len);

    //   // if(progressData.ind) {
    //   //   this.progress = Math.floor(progressData.obj.percentage * 100);
    //   //   this.changeRef.detectChanges();
    //   // }
    // });

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
  // }

  setupProgressRings() {
    this.ringArray = this.queueService.consolidatedData.items.map( item => ({
      index: item.position,
      title: item.title
    }));
  }

  onClicked(e: MouseEvent) {
    this.notifyConvert.emit();
  }


  // ----------------------------------------------------------------------
  //
  // ng2 lifecycle - in sequence
  //
  // ----------------------------------------------------------------------

  ngOnInit() {
    // this.attachSubscribers();
    this.setupProgressRings();
  }

}
