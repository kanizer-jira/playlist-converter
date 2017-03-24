import { Component, Input } from '@angular/core';
import { QueueService, CONVERSION_QUEUE_COMPLETE }     from './queue.service';
import { EmitterService }   from '../shared/service/emitter.service';
import { IPlaylistItem }    from '../shared/types';

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

  constructor(private qs: QueueService) {
  }

  ngOnInit() {
    // listen to input form component
    // - doesn't register if set in constructor
    // - returns data object or false if youtube api req fails
    EmitterService.get(this.playlistKey)
    .subscribe( (playlistData: IPlaylistItem[]) => {
      this.queueArray = playlistData;
      this.qs.startQueue(); // TODO - replace with user init
      this.showOverlay = false;
    },
    (err: any) => {
      // TODO - display some greyed out error state
      console.log('wtf', err);
      this.showOverlay = true;
      this.overlayMsg = 'Playlist request failed.';
    } );

    EmitterService.get(CONVERSION_QUEUE_COMPLETE)
    .subscribe( (msg: string) => {
      console.log('queue.ts: conversion queue complete: msg:', msg);
      // TODO - activate download button
    });
  }

}
