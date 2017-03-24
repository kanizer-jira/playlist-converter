import { Component, Input }        from '@angular/core';
import { Response }                from '@angular/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable }              from 'rxjs/Observable';
import { EmitterService }          from '../shared/service/emitter.service';
import { IPlaylistItem }           from '../shared/types';
import { QueueService }            from '../queue/queue.service';

@Component({
  selector: 'cheap-thrills-input',
  template: require('./input.html')
})
export class InputComponent {

  @Input()
  public playlistKey: string; // passed in as template attribute

  // instantiate and config via FormBuilder
  public captureIdForm = this.fb.group({
    playlistId: ['', Validators.required]
  });

  private statusMessage: string;

  constructor(public qs: QueueService, public fb: FormBuilder) {
  }

  // capture/handle input event
  onSubmit(event: Event) {
    // const playlistId = this.captureIdForm.value.playlistId;
    const playlistId = 'PLV2v9WNyDEGB80tDATwShnqI_P9-biTho'; // TODO - remove when ready to test

    // update status message
    EmitterService.get(this.playlistKey)
    .subscribe( (playlistData: IPlaylistItem[]) => {
      this.statusMessage = 'Cool, found your playlist.';
    },
    (err: any) => {
      this.statusMessage = 'You liar, that playlist is fake.';
    } );

    // make request to youtube api via QueueService
    this.qs.getPlaylistData(this.playlistKey, playlistId);
  }

  ngOnInit() {
    this.onSubmit(new MouseEvent('mock submit'));
  }

}
