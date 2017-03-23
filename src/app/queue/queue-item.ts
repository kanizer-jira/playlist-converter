import { Component, Input }                               from '@angular/core';
import { QueueService }                                   from './queue.service';
import { IPlaylistItem, IThumbnailItem, IConversionItem } from '../shared/types';

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
    // this.queueService.getConversion(this.queueItem.videoId).subscribe(
    //   (response: IConversionItem) => {
    //     this.conversionData = response;
    //     console.log('requestConversion: this.conversionData:', this.conversionData);
    //     // TODO - pass url to download consolidation endpoint...that you need to make
    //   },
    //   err => {
    //     // TODO - handle error
    //     console.log('queue-item.ts: requestConversion: err:', err);
    //   }
    // );
  }


  // ----------------------------------------------------------------------
  //
  // ng2 lifecycle - in sequence
  //
  // ----------------------------------------------------------------------

  ngOnChanges(changes: any) {
    // Called right after our bindings have been checked but only
    // if one of our bindings has changed.
    //
    // changes is an object of the format:
    // {
    //   'prop': PropertyUpdate
    // }
  }

  ngOnInit() {
    // setup thumbnail
    this.thumbnail = this.queueItem.thumbnails.default;

    // TODO - should be triggered by queue; rapid requests sometimes bounce back a refresh header with no content
    // request mp3 conversion
    // this.requestConversion();
  }

  ngDoCheck() {
    // Custom change detection
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

  ngOnDestroy() {
    // Speak now or forever hold your peace
  }

}
