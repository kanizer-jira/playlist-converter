import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewChildren,
  QueryList
}                                      from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {
  QueueService,
  QUEUE_COMPLETE,
  QUEUE_ERROR
}                                      from './queue.service';
import { QueueItemComponent }          from './queue-item';
import { EmitterService }              from '../shared/service/emitter.service';
import { IPlaylistItem, IArchiveItem } from '../shared/types';
import { Subscription }                from 'rxjs';
import { TimerObservable }             from 'rxjs/observable/TimerObservable';

import { BigButtonComponent } from '../button/button';


@Component({
  selector: 'cheapthrills-queue',
  template: require('./queue.html'),
  animations: [
    trigger('revealState', [
      state('inactive', style({
        transform: 'translate(-100%, -50%)',
        opacity: 0
      })),
      state('active', style({
        transform: '*',
        opacity: 1
      })),
      transition('inactive => active', animate('300ms 100ms ease-in-out')),
      transition('active => inactive', animate('300ms ease-in'))
    ])
  ]
})
export class QueueComponent {
  @Input()
  public playlistKey   : string;
  public queueArray    : IPlaylistItem[];
  public queueItem     : IPlaylistItem;
  public showOverlay   : boolean;
  public overlayMsg    : string;
  public queueComplete : boolean;
  public downloadPath  : string;
  private timerSub     : Subscription;
  private destroyed    : boolean;
  private revealState: string = 'inactive';

  @Output()
  private notifySearchOutro: EventEmitter<boolean> = new EventEmitter<boolean>(); // update parent component styles

  @ViewChildren(QueueItemComponent) viewChildren: QueryList<QueueItemComponent>;

  constructor(private qs: QueueService) {
  }

  buildQueue(data: IPlaylistItem[]) {
    const timer = TimerObservable.create(60, 60).take(data.length); // weird signature - i guess the 2nd param is the subsequent duration
    this.timerSub = timer.subscribe( (t: number) => {
      this.queueArray = this.queueArray || [];
      this.queueArray.push(data[t]);
      if(t === data.length - 1) {
        this.timerSub.unsubscribe();
        // show back button
        this.revealState = 'active';
      }
    });
  }

  destroyQueue() {
    this.showOverlay = false;
    this.queueComplete = false;
    this.downloadPath = undefined;

    // add fade class to element
    this.destroyed = true;
    const timer = TimerObservable.create(300); // duration of fade
    this.timerSub = timer.subscribe( (t: number) => {
      this.qs.resetQueue();
      this.queueArray = undefined;
      this.notifySearchOutro.emit(false); // dispatch state to parent
      this.timerSub.unsubscribe();
    });
  }

  onConvertClicked(e: Event) {
    const optionsArray = this.viewChildren.toArray().map( item => item.options );
    this.qs.updateOptions(optionsArray); // update model with optional field data
    this.qs.startQueue();
  }

  onClickBackButton(e: Event) {
    this.destroyQueue();
  }


  // ----------------------------------------------------------------------
  //
  // lifecycle events
  //
  // ----------------------------------------------------------------------
  ngOnInit() {
    // listen to input form component
    // - doesn't register if set in constructor
    // - returns data object or false if youtube api req fails
    EmitterService.get(this.playlistKey + '-ready')
    .subscribe( (playlistData: IPlaylistItem[]) => {
      // sequentially add to queueArray to insert delay in queue item animation
      this.destroyed = false;
      this.showOverlay = false;
      this.buildQueue(playlistData);
    },
    (err: any) => {
      // error state shown in input field
      console.log('queue.ts: ngOnInit: playlist req failure: err:', err);
      this.showOverlay = true;
      this.overlayMsg = 'Playlist request failed.';
    } );

    EmitterService.get(QUEUE_COMPLETE)
    .subscribe( (res: IArchiveItem) => {
      console.log('queue.ts: conversion queue complete: res:', res);
      // activate download button
      this.queueComplete = true;
      this.downloadPath = res.downloadPath;
    });

    EmitterService.get(QUEUE_ERROR)
    .subscribe( (msg: string) => {
      console.log('queue.ts: conversion queue error: msg:', msg);
    });
  }

  ngOnDestroy() {
    this.revealState = 'inactive';
  }

}
