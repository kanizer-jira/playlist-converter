import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Response }                               from '@angular/http';
import { FormBuilder, Validators }                from '@angular/forms';
// import { Subscription }                           from 'rxjs';
// import { Observable }                             from 'rxjs/Observable';
import { EmitterService }                         from '../shared/service/emitter.service';
import { SubjectService }                         from '../shared/service/subject.service';
import { IPlaylistItem }                          from '../shared/types';
import { QueueService }                           from '../queue/queue.service';

const SPOOF_SUBMISSION: boolean = false;

@Component({
  selector: 'cheapthrills-input',
  template: require('./input.html')
})
export class InputComponent {

  // passed in as template attributes
  @Input()
  public playlistKey: string;
  @Input()
  public outro: boolean;

  // instantiate and config via FormBuilder
  public captureIdForm = this.fb.group({
    playlistId: ['', Validators.required]
  });

  private status: boolean;
  private statusMessage: string;
  private disabled: boolean;
  private reveal: boolean;
  private inactive: boolean;

  @Output()
  private notifySearchOutro: EventEmitter<boolean> = new EventEmitter<boolean>(); // update parent component styles
  // private _subPlaylistRequest : Subscription;

  constructor(public qs: QueueService, public fb: FormBuilder) {
  }

  setupObserver() {
    // EmitterService.get(this.playlistKey)
    SubjectService.get(this.playlistKey)
      .subscribe( (playlistData: IPlaylistItem[] | any) => {
        this.status = true;
        this.statusMessage = 'Cool, found your playlist.';

        // outro animation after short delay to register status message
        let to = setTimeout(() => {
          this.inactive = true;
          this.notifySearchOutro.emit(true); // dispatch state to parent
          clearTimeout(to);

          // dispatch animation completion event with playlistData to initiate queue rendering
          EmitterService.get(this.playlistKey + '-ready')
          .emit(playlistData);

          // // close this subject
          // SubjectService.get(this.playlistKey).complete();
        }, 500);
      },
      (err: Error) => {
        this.disabled = false;
        this.status = false;
        this.statusMessage = err.message;
        return;
      },
      () => { console.log('input.ts: SubjectService completed'); });
  }

  // capture/handle input event
  onSubmit(event: Event) {
    // disable additional clicks
    this.disabled = true;
    let playlistId = this.normalizePlaylistId(this.captureIdForm.value.playlistId);
    if(SPOOF_SUBMISSION) {
      playlistId = 'PLV2v9WNyDEGB80tDATwShnqI_P9-biTho';
    }

    // update status message
    this.status = true;
    this.statusMessage = 'Requesting your playlist - please hold...';

    // make request to youtube api via QueueService
    this.qs.getPlaylistTitle(this.playlistKey, playlistId);
  }

  normalizePlaylistId(s: string): string {
    return (s.includes('/') || s.includes('youtube')) ? s.split('list=').pop() : s;
  }


  // ----------------------------------------------------------------------
  //
  // lifecycle
  //
  // ----------------------------------------------------------------------

  ngOnInit() {
    this.setupObserver();

    // auto-init for testing
    if(SPOOF_SUBMISSION) {
      this.onSubmit(new MouseEvent('mock submit'));
    }
  }

  ngAfterViewInit() {
    // need to delay css assignment for transition
    let to = setTimeout( _ => {
      this.reveal = true;
      clearTimeout(to);
    }, 5);
  }

  ngOnChanges(changes: any) {
    if(changes.outro && !changes.outro.currentValue) {
      this.disabled = false;
      this.inactive = false;

      // hide status message
      this.status = false;
      this.statusMessage = '';
    }
  }

}
