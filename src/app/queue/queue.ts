import { Component, Input, ViewChildren, QueryList } from '@angular/core';
import {
  QueueService,
  QUEUE_COMPLETE,
  QUEUE_ERROR }     from './queue.service';
import { QueueItemComponent } from './queue-item';
import { EmitterService }   from '../shared/service/emitter.service';
import { IPlaylistItem, IArchiveItem }    from '../shared/types';

@Component({
  selector: 'cheap-thrills-queue',
  template: require('./queue.html')
})
export class QueueComponent {
  @Input()
  public playlistKey : string;
  public queueArray  : IPlaylistItem[];
  public queueItem   : IPlaylistItem;
  public showOverlay : boolean;
  public overlayMsg  : string;
  public queueComplete : boolean;
  public downloadPath: string;

  @ViewChildren(QueueItemComponent) viewChildren: QueryList<QueueItemComponent>;

  constructor(private qs: QueueService) {
  }

  onConvertClicked(e: Event) {
    const optionsArray = this.viewChildren.toArray().map( item => item.options );
    this.qs.updateOptions(optionsArray); // update model with optional field data
    this.qs.startQueue();
  }

  ngOnInit() {
    // listen to input form component
    // - doesn't register if set in constructor
    // - returns data object or false if youtube api req fails
    EmitterService.get(this.playlistKey)
    .subscribe( (playlistData: IPlaylistItem[]) => {
      this.queueArray = playlistData;
      this.showOverlay = false;
    },
    (err: any) => {
      // TODO - display some greyed out error state
      console.log('wtf', err);
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
      // TODO - display error
    });
  }

  // ngAfterViewInit() {
  //   console.log('queue.ts: ngAfterViewInit: this.viewChildren:', this.viewChildren.toArray());
  // }

}
