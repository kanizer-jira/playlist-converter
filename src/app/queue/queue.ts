import {Component, Input}  from '@angular/core';
import { QueueService } from './queue.service';
import { EmitterService } from '../shared/service/emitter.service';

export interface IPlaylistItem {
  videoId: string;
  position: number;
  title: string;
  description: string;
  thumbnails: any; // TODO - convert to IThumbnail if you feel like it
}

export interface IThumbnailItem {
  url: string;
  width: number;
  height: number;
}

@Component({
  selector: 'cheap-thrills-queue',
  template: require('./queue.html')
})
export class QueueComponent {
  @Input()
  public playlistKey   : string;
  public queueArray    : IPlaylistItem[];
  public queueItem     : IPlaylistItem;
  private qs : QueueService;

  constructor(queueService: QueueService) {
    this.qs = queueService;
  }

  ngOnInit() {
    // listen to input form component
    // - doesn't register if set in constructor
    // - returns data object or false if youtube api req fails
    EmitterService.get(this.playlistKey)
    .subscribe( (playlistData: IPlaylistItem[]) => {
      this.queueArray = playlistData;
      this.qs.startQueue(); // TODO - replace with user init
    });
  }

}
