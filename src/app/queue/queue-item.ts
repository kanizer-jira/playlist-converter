import { Component, Input, NgZone, ChangeDetectorRef } from '@angular/core';
import {
  QueueService,
  QUEUE_ITEM_ERROR,
  QUEUE_ITEM_PROGRESS,
  QUEUE_ITEM_COMPLETE,
  QUEUE_COMPLETE
}                           from './queue.service';
import { EmitterService }   from '../shared/service/emitter.service';
import {
  IPlaylistItem,
  IThumbnailItem,
  IConversionItem
}                           from '../shared/types';

@Component({
  selector: 'cheap-thrills-queue-item',
  template: require('./queue-item.html')
})
export class QueueItemComponent {
  @Input()
  public queueItem          : IPlaylistItem;
  public thumbnail          : IThumbnailItem;
  public conversionData     : IConversionItem;
  public progress           : number;
  public conversionComplete : boolean;
  public errorMsg           : string = '';
  private queueService      : QueueService;

  constructor(public zone: NgZone, public changeRef: ChangeDetectorRef, queueService: QueueService) {
    // TODO - monitor status of queue items
    this.queueService = queueService;
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
  }

}
