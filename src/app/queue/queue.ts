import { Component, Input } from '@angular/core';
import { QueueService }     from './queue.service';
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

  constructor(private qs: QueueService) {
  }

  ngOnInit() {
    // listen to input form component
    // - doesn't register if set in constructor
    // - returns data object or false if youtube api req fails
    EmitterService.get(this.playlistKey)
    .subscribe( (playlistData: IPlaylistItem[]) => {
      this.queueArray = playlistData;
      console.log('queue.ts: playlistData:', playlistData);
      this.qs.startQueue(); // TODO - replace with user init
    },
    (err: any) => {
      // TODO - display some greyed out error state
      console.log('wtf', err);
    } );
  }

}
