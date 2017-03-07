import {Component, Input} from '@angular/core';
import {QueueItem} from './queue';

@Component({
  selector: 'cheap-thrills-queue-items',
  template: require('./queue-item.html')
})
export class QueueItemComponent {
  @Input() public queueItem: QueueItem;

  constructor() {
    // console.log('hello', this);
  }

  ngOnInit() {
    // console.log('ngOnInit: queueItem:', this.queueItem);

    // Properties are resolved and things like
    // this.mapWindow and this.mapControls
    // had a chance to resolve from the
    // two child components <map-window> and <map-controls>
  }
  ngOnDestroy() {
    // Speak now or forever hold your peace
  }
  ngDoCheck() {
    // Custom change detection
  }
  // TODO - double check TypeScript typing syntax
  ngOnChanges(changes: Object) {
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
