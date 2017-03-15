import { Component, Input }               from '@angular/core';
import { Http, Response }          from '@angular/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable }              from 'rxjs/Observable';
import { EmitterService }          from '../shared/service/emitter.service';

// TODO - obscure API key...maybe in env key?
const API_URL = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet'; // & playlistId, maxResults, key
const API_KEY = 'AIzaSyBDnRXFXWi2KPsbBpUOhGoMmIKuUTXDHrg';

// define the schema for returned Observable from http request
// export class IPlaylistData {
//   constructor(
//     public items: Array<Object>,
//     public nextPageToken: String
//   ) {}
// }

export interface IPlaylistData {
  items: Array<any>;
  nextPageToken: String;

  // // don't care about these
  // etag: String;
  // kind: String;
  // pageInfo: Object;
}

// TODO - `string` vs `String`; think lowercase is reserved for TS
export interface IPlaylistItem {
  id: String;
  thumbnails: Array<any>;
  title: String;
  description: String;
  position: Number;
}

@Component({
  selector: 'cheap-thrills-input',
  template: require('./input.html')
})
export class InputComponent {
  public playlistId: String = '';
  public consolidatedData: IPlaylistData;

  // instantiate and config via FormBuilder
  public captureIdForm = this.fb.group({
    playlistId: ['', Validators.required]
    // validators provide valid flag that can be read in markup
    // alternatively can group array of Validators
    // playlistId: ['', Validators.compose([
    //     Validators.required,
    //     Validators.minLength(5),
    //     Validators.maxLength(10)
    //   ])
    // ]
  });

  @Input() playlistKey: string; // passed in as template attribute

  private statusMessage: String;
  private pageToken: String;
  private mockPlaylistId: String = 'PLV2v9WNyDEGB80tDATwShnqI_P9-biTho';

  // the http param is auto-injected somehow?
  // - just available to use as an internal property
  constructor(public http: Http, public fb: FormBuilder) {
    this.requestPlaylist(new MouseEvent('mock submit'));
  }

  // Observable<Response>
  // - Response is replaced with an array of DataType;
  //   array because it's like a sequence of responses
  // - <> brackets mean List/Array contents type
  getComments(): Observable<IPlaylistData[]> {
    const pagination = this.pageToken ? `&pageToken=${this.pageToken}` : '';

    return this.http
      .get(API_URL, {
        // arbitrary maxLength to force the need for pagination
        search: `playlistId=${this.playlistId}&maxLength=10&key=${API_KEY}${pagination}`
      })
      // ...and calling .json() on the response to return data
      .map((res: Response) => {
        // returns http response; headers, status, body, etc...
        // - converting to an array to match expected response type from Observable (dumb! probably not right?)
        return [res.json()];
        // throw Error('testing');
      })
      // ...errors if any
      // this shit throws compile time errors if you leave this catch statement out!
      .catch((error: any) => {
        return Observable.throw(error || 'Server error');
      });
  }

  requestPlaylist(event: Event) {
    // capture/handle input event
    this.playlistId = this.captureIdForm.value.playlistId;
    this.playlistId = this.mockPlaylistId;

    // handle request to Youtube Playlist API
    // - subscribe to observer for http reqs to youtube api
    // - doesn't seem to compound listeners to re-assign this subscriber
    this.getComments().subscribe(
      result => {
        const simplifiedVideoObjects = result[0].items
          .map( (item: any) => ({
            id: item.snippet.resourceId.videoId,
            thumbnails: item.snippet.thumbnails,
            title: item.snippet.title,
            description: item.snippet.description,
            position: item.snippet.position
          }));

        // merge with existing to build single model from pagination
        this.consolidatedData = {
          items: !this.consolidatedData
            ? simplifiedVideoObjects
            : this.consolidatedData.items.concat(simplifiedVideoObjects),
          nextPageToken: null // just need this to match interface - dumb
        };

        // recurse
        this.pageToken = result[0].nextPageToken;
        if(this.pageToken) {
          this.requestPlaylist(event);
          return;
        }

        // emit 'model ready' type event
        EmitterService.get(this.playlistKey)
        .emit(this.consolidatedData.items);

        // update status message
        this.statusMessage = 'Cool, found your playlist.';
      },
      err => {
        // emit 'model ready' type event
        EmitterService.get(this.playlistKey)
        .emit(false);

        this.statusMessage = 'You liar, that playlist is fake.';
      },
      () => {
        // console.log('every time');
      }
    );

  }

}
