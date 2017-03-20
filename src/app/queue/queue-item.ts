import { Component, Input }              from '@angular/core';
import { IPlaylistItem, IThumbnailItem } from './queue';
import { QueueService } from './queue.service';

export interface IConversionItem {
  title: string;
  length: number;
  link: string; // TODO - convert to URL type
}

@Component({
  selector: 'cheap-thrills-queue-item',
  template: require('./queue-item.html')
})
export class QueueItemComponent {
  @Input()
  public queueItem      : IPlaylistItem;
  public thumbnail      : IThumbnailItem;
  public conversionData : IConversionItem;
  private queueService  : QueueService;

  constructor(queueService: QueueService) {
    // TODO - monitor status of queue items
    this.queueService = queueService;
  }

  requestConversion() {
    this.queueService.getConversion(this.queueItem.videoId).subscribe(
      (response: IConversionItem) => {
        this.conversionData = response;
        console.log('requestConversion: this.conversionData:', this.conversionData);
        // TODO - pass url to download consolidation endpoint...that you need to make
      },
      err => {
        // TODO - handle error
        console.log('queue-item.ts: requestConversion: err:', err);
      }
    );
  }

  ngOnInit() {
    // setup thumbnail
    this.thumbnail = this.queueItem.thumbnails.default;

    // TODO - should be triggered by queue; rapid requests sometimes bounce back a refresh header with no content
    // request mp3 conversion
    this.requestConversion();
  }















  ngOnDestroy() {
    // Speak now or forever hold your peace
  }

  ngDoCheck() {
    // Custom change detection
  }

  ngOnChanges(changes: any) {
    // Called right after our bindings have been checked but only
    // if one of our bindings has changed.
    //
    // changes is an object of the format:
    // {
    //   'prop': PropertyUpdate
    // }
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

}
