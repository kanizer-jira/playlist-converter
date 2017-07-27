import {
  Component,
  Output,
  ChangeDetectorRef,
  EventEmitter
}                                 from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
}                                 from '@angular/animations';
import { Observable, Subscription }           from 'rxjs';
import { TimerObservable }        from 'rxjs/observable/TimerObservable';
import { BigButtonRingComponent } from './button-ring';
import {
  QueueService,
  QUEUE_ITEM_PROGRESS,
  QUEUE_ITEM_COMPLETE,
  QUEUE_COMPLETE,
  QUEUE_ERROR
}                                 from '../queue/queue.service';
import {
  IArchiveItem,
  IRingProgressItem
}                                 from '../shared/types';
import { EmitterService }         from '../shared/service/emitter.service';


@Component({
  selector: 'cheapthrills-button',
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
  private subProgress: Subscription;
  private subComplete: Subscription;
  private subError: Subscription;
  private currentProgress: number = 0;
  private timer: Observable<number>;
  private timerSub: Subscription;

  constructor(
    public changeRef: ChangeDetectorRef,
    private queueService: QueueService
  ) {}

  attachSubscribers() {
    this.subProgress = EmitterService
    .get(QUEUE_ITEM_PROGRESS)
    .subscribe( (progressData: any) => {

      // calculate relative lengths of songs / total percentage
      const len: number = this.queueService.consolidatedData.items.length;
      const prevProgress: number = progressData.ind / len;
      const currProgress: number = progressData.obj.percentage / len;
      const totalProgress: number = prevProgress + currProgress;

      this.currentProgress = Math.floor(totalProgress * 100);
      this.label = this.currentProgress + '%';
      this.progressColor = this.getUpdatedFillColor(totalProgress);

      this.changeRef.detectChanges();
    });

    this.subComplete = EmitterService.get(QUEUE_COMPLETE)
    .subscribe( (res: IArchiveItem) => {
      console.log('button.ts: conversion queue complete: res:', res);
      // activate download button
      this.label = 'download';
      this.downloadPath = res.downloadPath;
    });

    this.subError = EmitterService.get(QUEUE_ERROR)
    .subscribe( (msg: string) => {
      console.log('button.ts: conversion queue error: msg:', msg);
      // TODO - display error
    });
  }

  detachSubscribers() {
    this.subProgress.unsubscribe();
    this.subComplete.unsubscribe();
    this.subError.unsubscribe();
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

  onClicked(e: MouseEvent) {
    // ghetto debounce
    if(!this.timerSub || this.timerSub.closed) {
      this.timerSub = this.timer.subscribe( (t: number) => {
        this.timerSub.unsubscribe();
      });

      switch(this.label) {
        case 'start':
          console.log('button.ts: start clicked');
          this.label = this.currentProgress + '%';
          this.notifyConvert.emit();
          break;

        case 'download':
          console.log('button.ts: download clicked');
          // src attribute is populated - no action required here
          break;

        case 'resume':
          console.log('button.ts: resume clicked');
          this.label = this.currentProgress + '%';
          this.queueService.resumeQueue();
          break;

        default:
          console.log('button.ts: cancel clicked');
          // pause conversion...
          this.queueService.pauseQueue();
          this.label = 'resume';
      }

      return;
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

    // debouncer
    this.timer = TimerObservable.create(1000);
  }

  ngOnDestroy() {
    this.detachSubscribers();
  }

}
