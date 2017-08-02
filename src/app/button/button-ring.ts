import {
  Component,
  Input,
  ElementRef,
}                          from '@angular/core';
import { Subscription }    from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import {
  QueueService,
  QUEUE_ITEM_PROGRESS,
  QUEUE_COMPLETE,
  QUEUE_ERROR
}                          from '../queue/queue.service';
import {
  IRingProgressItem,
  IArchiveItem
}                          from '../shared/types';
import { EmitterService }  from '../shared/service/emitter.service';


@Component({
  selector: 'cheapthrills-button-ring',
  template: require('./button-ring.html')
})
export class BigButtonRingComponent {
  public ringEl: any;
  public ringLen: number;

  // sync with styles
  public centerPosX: number = 90 / 2;
  public centerPosY: number = 90 / 2;
  public radius: number = 90 / 2 - 2;

  public segmentLen: number;
  public segmentIndex: number;
  public segmentRotation: string;
  public segmentColor: string = 'blue';
  public segmentWidth: string = '2';

  @Input()
  private ringItem: IRingProgressItem;
  private subProgress: Subscription;
  private subComplete: Subscription;
  private active: boolean;

  constructor(
    public el: ElementRef,
    private queueService: QueueService
  ) {}

  attachSubscribers() {
    this.subProgress = EmitterService
      .get(QUEUE_ITEM_PROGRESS)
      .subscribe( (progressData: any) => {

        // calculate relative lengths of songs / total percentage
        var len: number = this.queueService.consolidatedData.items.length;

        if(progressData.ind === this.segmentIndex) {
          this.updateRingProgress( progressData.obj.percentage );
        }
      });

    this.subComplete = EmitterService.get(QUEUE_COMPLETE)
      .subscribe( (res: IArchiveItem) => {
        this.segmentWidth = '1';

      });
  }

  detachSubscribers() {
    this.active = false;
    this.subProgress.unsubscribe();
    this.subComplete.unsubscribe();
  }

  initRingStyles() {
    const totalSegments: number = this.queueService.consolidatedData.items.length;
    this.segmentIndex = this.ringItem.index;

    // define svn element
    this.ringEl = this.el.nativeElement.querySelector('circle');
    this.ringLen = this.ringEl.getTotalLength();
    this.segmentLen = this.ringLen * ( 1 / totalSegments );

    // assign rotation and percentage to reveal
    const rotation: number = ( ( this.segmentIndex / totalSegments ) * 360 ) - 90;
    this.segmentRotation = `rotate(${rotation} ${this.centerPosX} ${this.centerPosY})`;

    // alternate color
    // this.segmentColor = "#" + ( ( 1 << 24 ) * Math.random() | 0 ).toString(16);
    this.segmentColor = 'transparent';

    // Set up the starting positions
    this.ringEl.style.strokeDasharray = this.ringLen + ' ' + this.ringLen;
    this.ringEl.style.strokeDashoffset = this.ringLen;

    // Trigger a layout so styles are calculated & the browser
    // picks up the starting position before animating
    this.ringEl.getBoundingClientRect();
  }

  updateRingProgress(percent: number) {
    if(!this.active) {
      this.active = true;

      // constrained to hue
      const shadeIncrement: number = 200 - 10 * this.segmentIndex;
      this.segmentColor = `rgba(255, ${30 + shadeIncrement}, 0, 1)`;
    }

    // convert percent to offset
    this.segmentWidth = Math.max(2, Math.ceil(percent * 4)) + '';
    this.ringEl.style.strokeDashoffset = this.ringLen - ( percent * this.segmentLen ) + '';
  }


  // ----------------------------------------------------------------------
  //
  // ng2 lifecycle - in sequence
  //
  // ----------------------------------------------------------------------

  ngOnInit() {
    this.attachSubscribers();
    this.initRingStyles(); // establish init state
  }

  ngAfterViewInit() {
    this.initRingStyles();
  }

  ngOnDestroy() {
    this.detachSubscribers();
  }

}
