import {
  Component,
  // Input,
  Output,
  // NgZone,
  ChangeDetectorRef,
  // ElementRef,
  // Renderer,
  EventEmitter
}                          from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
}                          from '@angular/animations';


// import { Subscription }    from 'rxjs';
// import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { BigButtonRingComponent } from './button-ring';
import {
  QueueService,
  // QUEUE_ITEM_ERROR,
  // QUEUE_ITEM_INITIATE_CONVERSION,
  QUEUE_ITEM_PROGRESS,
  QUEUE_ITEM_COMPLETE,
  QUEUE_COMPLETE,
  QUEUE_ERROR
}                          from '../queue/queue.service';
import {
  // IPlaylistItem,
  // IThumbnailItem,
  // IConversionItem,
  IArchiveItem,
  IRingProgressItem
}                          from '../shared/types';
import { EmitterService }  from '../shared/service/emitter.service';


@Component({
  selector: 'cheap-thrills-button',
  template: require('./button.html')
})
export class BigButtonComponent {
  public label: string = 'start';
  public downloadPath: string;
  public progressColor: string = 'rgba(190, 85, 10, 1)';
  // public targetColor: string = 'rgba(255, 96, 0, 1)';

  @Output()
  private notifyConvert: EventEmitter<null> = new EventEmitter<null>();
  private ringArray: IRingProgressItem[];

  constructor(
    public changeRef: ChangeDetectorRef,
    private queueService: QueueService
  ) {}

  attachSubscribers() {

    // transform button label and color

    EmitterService
    .get(QUEUE_ITEM_PROGRESS)
    .subscribe( (progressData: any) => {

      // calculate relative lengths of songs / total percentage
      const len: number = this.queueService.consolidatedData.items.length;
      const prevProgress: number = progressData.ind / len;
      const currProgress: number = progressData.obj.percentage / len;
      const totalProgress: number = prevProgress + currProgress;

      this.label = Math.floor(totalProgress * 100) + '%';
      this.progressColor = this.getUpdatedFillColor(totalProgress);

      this.changeRef.detectChanges();
    });

    EmitterService.get(QUEUE_COMPLETE)
    .subscribe( (res: IArchiveItem) => {
      console.log('button.ts: conversion queue complete: res:', res);
      // activate download button
      this.label = 'download';
      this.downloadPath = res.downloadPath;
    });

    EmitterService.get(QUEUE_ERROR)
    .subscribe( (msg: string) => {
      console.log('button.ts: conversion queue error: msg:', msg);
      // TODO - display error
    });
  }

  getUpdatedFillColor(progress: number) {
    return `rgba(${190 + Math.ceil(progress * 65)}, ${85 + Math.ceil(progress * 10)}, ${10 - Math.ceil(progress * 10)}, 1)`;
  }

  setupProgressRings() {
    this.ringArray = this.queueService.consolidatedData.items.map( item => ({
      index: item.position,
      title: item.title
    }));
  }

  initProgress() {
    // update color
    // update copy
  }

  onClicked(e: MouseEvent) {
    switch(this.label) {
      case 'start':
        this.notifyConvert.emit();
        this.initProgress();
        break;

      case 'download':
        console.log('button.ts: download clicked: e:', e);
        // TODO - implement
        break;

      case 'resume':
        console.log('button.ts: resume clicked: e:', e);
        this.queueService.resumeQueue();
        break;

      default:
        console.log('button.ts: cancel clicked: e:', e);
        // pause conversion...
        this.queueService.pauseQueue();
        this.label = 'resume';
    }
  }


  // ----------------------------------------------------------------------
  //
  // ng2 lifecycle - in sequence
  //
  // ----------------------------------------------------------------------

  ngOnInit() {
    this.attachSubscribers();
    this.setupProgressRings();
  }

}
