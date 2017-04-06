import { Component, Input } from '@angular/core';
import {
  QueueService,
  QUEUE_COMPLETE,
  QUEUE_ERROR }     from './queue.service';
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

  constructor(private qs: QueueService) {
  }

  onDownloadClicked(e: Event) {
    // TODO - download playlist archive
    console.log('queue.ts: onDownloadClicked: e:', e, this.downloadPath);

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

    EmitterService.get(QUEUE_COMPLETE)
    .subscribe( (res: IArchiveItem) => {
      console.log('queue.ts: conversion queue complete: res:', res);
      // activate download button
      this.queueComplete = true;
      this.downloadPath = res.downloadPath;
      // TODO - need to force state change?
    });

    EmitterService.get(QUEUE_ERROR)
    .subscribe( (msg: string) => {
      console.log('queue.ts: conversion queue error: msg:', msg);
      // TODO - display error
    });
  }

}
