import { Component, Input }                               from '@angular/core';
import { QueueService, CONVERSION_KEY }                   from './queue.service';
import { EmitterService }                                 from '../shared/service/emitter.service';
import { IPlaylistItem, IThumbnailItem, IConversionItem } from '../shared/types';

@Component({
  selector: 'cheap-thrills-queue-item',
  template: require('./queue-item.html')
})
export class QueueItemComponent {
  @Input()
  public queueItem      : IPlaylistItem;
  public thumbnail      : IThumbnailItem;
  public conversionData : IConversionItem = { title: '', length: 0, link: 'temporary filler' };
  private queueService  : QueueService;

  constructor(queueService: QueueService) {
    // TODO - monitor status of queue items
    this.queueService = queueService;
  }


  // ----------------------------------------------------------------------
  //
  // ng2 lifecycle - in sequence
  //
  // ----------------------------------------------------------------------

  ngOnChanges(changes: any) {
    // Called right after our bindings have been checked but only
    // if one of our bindings has changed.
  }

  ngOnInit() {
    // setup thumbnail
    this.thumbnail = this.queueItem.thumbnails.default;

    // listen for mp3 conversion
    EmitterService
    .get('CONVERSION_KEY_' + this.queueItem.position)
    .subscribe( (conversionData: IConversionItem) => {
      this.conversionData = conversionData;
      this.conversionData.link = decodeURIComponent(this.conversionData.link);
    },
    (err: any) => {
      // TODO - display conversion error
      console.log('queue-item.ts: ngOnInit: err:', err);
    });

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
