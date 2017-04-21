import { Component, Output } from '@angular/core';
import { InputModule } from './input';
import { QueueModule } from './queue';

@Component({
  selector: 'cheapthrills-app',
  template: require('./main.html') // tslint:disable-line:no-var-requires
})
export class MainComponent {
  // Event tracking props
  private playlistKey: string = 'REQUEST_PLAYLIST_KEY';
  private outro: boolean;


  // ----------------------------------------------------------------------
  //
  // event handler
  //
  // ----------------------------------------------------------------------

  // handle playlist data completion event
  onNotify(e: Event) {
    this.outro = true;
  }


  // ------------------------------------------------------------
  //
  // lifecycle events for reference
  //
  // ------------------------------------------------------------

  ngOnInit() {
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
