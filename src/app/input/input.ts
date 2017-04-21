import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Response }                               from '@angular/http';
import { FormBuilder, Validators }                from '@angular/forms';
import { Observable }                             from 'rxjs/Observable';
import { EmitterService }                         from '../shared/service/emitter.service';
import { IPlaylistItem }                          from '../shared/types';
import { QueueService }                           from '../queue/queue.service';

@Component({
  selector: 'cheapthrills-input',
  template: require('./input.html')
})
export class InputComponent {

  @Input()
  public playlistKey: string; // passed in as template attribute

  // instantiate and config via FormBuilder
  public captureIdForm = this.fb.group({
    playlistId: ['', Validators.required]
  });

  private status: boolean;
  private statusMessage: string;
  private disabled: boolean;

  @Output()
  private notify: EventEmitter<boolean> = new EventEmitter<boolean>(); // update parent component styles

  constructor(public qs: QueueService, public fb: FormBuilder) {
  }

  onShow() {
    // TODO - implement reset in case returning from queue view
    this.disabled = false;
  }

  // capture/handle input event
  onSubmit(event: Event) {
    // disable additional clicks
    this.disabled = true;

    let playlistId = this.normalizePlaylistId(this.captureIdForm.value.playlistId);
    playlistId = 'PLV2v9WNyDEGDjuCwyZwlI8NzyvYZuc3y7'; // TODO - remove when ready to test

    // update status message
    this.status = true;
    this.statusMessage = 'Requesting your playlist - please hold...';

    EmitterService.get(this.playlistKey)
    .subscribe( (playlistData: IPlaylistItem[]) => {
      this.status = true;
      this.statusMessage = 'Cool, found your playlist.';

      // outro animation after short delay to register status message
      let to = setTimeout(() => {
        this.notify.emit(true);
        clearTimeout(to);

        // dispatch animation completion event with playlistData to initiate queue rendering
        EmitterService.get(this.playlistKey + '-ready')
        .emit(playlistData);
      }, 500);
    },
    (err: any) => {
      this.disabled = false;
      this.status = false;
      this.statusMessage = 'Fake playlist alert - please try again.';
    } );

    // make request to youtube api via QueueService
    this.qs.getPlaylistTitle(this.playlistKey, playlistId);
  }

  normalizePlaylistId(s: string): string {
    return (s.indexOf('/') || s.indexOf('youtube')) ? s.split('playlist?list=').pop() : s;
  }


  // ----------------------------------------------------------------------
  //
  // lifecycle
  //
  // ----------------------------------------------------------------------

  ngOnInit() {
    // auto-init for testing
    this.onSubmit(new MouseEvent('mock submit'));
  }

}
