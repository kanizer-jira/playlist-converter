import {Component, Input}  from '@angular/core';
import {Http}       from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { EmitterService } from '../shared/service/emitter.service';

export interface IPlaylistItem {
  id: string;
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
  public queueArray: IPlaylistItem[];
  public queueItem: IPlaylistItem;

  @Input() playlistKey: string;

  constructor(public http: Http) {
    // TODO - monitor status of queue items
  }

  ngOnInit() {
    // listen to input form component
    // - doesn't register if set in constructor
    // - returns data object or false if youtube api req fails
    EmitterService.get(this.playlistKey)
    .subscribe( (playlistData: IPlaylistItem[]) => {
      console.log('queue.ts: subscribe: playlistData:', playlistData);
      this.queueArray = playlistData;
    });
  }

  // TODO - populate queue items


  // getQueueData(): Observable<IPlaylistItem[]> {
  //   let test = this.http
  //     .get('app/queue/queue-model.json')
  //     .map(response => {
  //       return response.json();
  //     });
  //   return test;
  // }
}
