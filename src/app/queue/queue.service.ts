import { Injectable }      from '@angular/core';
import { Http, Response }  from '@angular/http';
import { Observable }      from 'rxjs/Observable';
import { EmitterService }  from '../shared/service/emitter.service';
import {
  IPlaylistData,
  IPlaylistItem,
  IConversionItem,
  IThumbnailItem
} from '../shared/types';

// TODO - declare globally and remove from here
// TypeScript declarations required for some reserved words...
declare var __DEV__: string;

// TODO - why does this fuck up tests?
// obscure API key
// if(__DEV__) {
  var devApiKey = require('../../_constants').YOUTUBE_API_KEY;  // tslint:disable-line:no-var-requires
// }
// const PLAYLIST_API_KEY = __DEV__ ? devApiKey : 'get from env';
const PLAYLIST_API_KEY = devApiKey;
const PLAYLIST_URL = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet'; // & playlistId, maxResults, key
const CONVERSION_API_URL: string = 'http://www.youtubeinmp3.com/fetch/';
const YOUTUBE_URL: string = 'http://www.youtube.com/watch?v=';

@Injectable()
export class QueueService {

  constructor(public http: Http) {
    // TODO - move all queue API related requests to here
    // TODO - unit tests
  }

  // ----------------------------------------------------------------------
  //
  // youtube api request and subscribe
  //
  // ----------------------------------------------------------------------

  public consolidatedData: IPlaylistData;
  private pageToken: string;

  // handle request to Youtube Playlist API
  // - subscribe to observer for http reqs to youtube api
  // - recurse for paginated response
  // - doesn't seem to compound listeners to re-assign this subscriber
  getPlaylistData(playlistKey: string, playlistId: string, pageToken: string = undefined) {
    this.requestPlaylist(playlistId)
    .subscribe( (result: IPlaylistData) => {
      const simplifiedVideoObjects = result.items
      .map( (item: any) => ({
        videoId: item.snippet.resourceId.videoId,
        thumbnails: item.snippet.thumbnails,
        title: item.snippet.title,
        description: item.snippet.description,
        position: item.snippet.position
      }) );

      // merge with existing to build single model from pagination
      this.consolidatedData = {
        items: !this.consolidatedData
          ? simplifiedVideoObjects
          : this.consolidatedData.items.concat(simplifiedVideoObjects),
        nextPageToken: undefined // just need this to match interface - dumb
      };

      // recurse
      if(this.pageToken !== result.nextPageToken) {
        this.pageToken = result.nextPageToken;
        this.getPlaylistData(playlistKey, playlistId, this.pageToken);
        return;
      }

      // emit 'model ready' type event
      EmitterService.get(playlistKey).emit(this.consolidatedData.items);
    },
    err => {
      // emit 'error' type event
      EmitterService.get(playlistKey).emit(false);
    },
    () => {
      // console.log('every time');
    } );
  }

  // Observable<Response>
  // - Response is replaced with an array of DataType;
  //   array because it's like a sequence of responses
  // - <> brackets mean List/Array contents type
  requestPlaylist(playlistId: string, pageToken: string = undefined): Observable<IPlaylistData> {
    const pagination = pageToken ? `&pageToken=${pageToken}` : '';

    return this.http
      .get(PLAYLIST_URL, {
        // arbitrary maxLength to force the need for pagination
        search: `playlistId=${playlistId}&maxLength=10&key=${PLAYLIST_API_KEY}${pagination}`
      })
      // ...and calling .json() on the response to return data
      .map((res: Response) => {
        // returns http response; headers, status, body, etc...
        // - converting to an array to match expected response type from Observable (dumb! probably not right?)
        return res.json();
        // throw Error('testing');
      })
      // ...errors if any
      // this shit throws compile time errors if you leave this catch statement out!
      .catch((error: any) => {
        return Observable.throw(error || 'Server error');
      });
  }


  // ----------------------------------------------------------------------
  //
  // conversion api request
  //
  // ----------------------------------------------------------------------

  getConversion(videoId: string): Observable<IConversionItem> {
    return this.http
      .get(CONVERSION_API_URL, {
        search: `format=JSON&video=${YOUTUBE_URL + videoId}`
      })
      .map((res: Response) => {
        return res;
      })
      .catch((error: any) => {
        return Observable.throw(error || 'Server error');
      });
  }


  // ----------------------------------------------------------------------
  //
  // queue execution/management
  //
  // ----------------------------------------------------------------------

  private queueIndex: number = 0;
  private queueActive: boolean;

  /**
   * kickoff/resume queue
   */
  startQueue() {
    if(this.queueActive) {
      return;
    }

    // this.getConversion()
  }

  /**
   * pause queue
   */
  pauseQueue() {
    if(!this.queueActive) {
      return;
    }
  }

  /**
   * stop and reset queue
   */
  resetQueue() {
    if(!this.queueActive) {
      return;
    }
  }

}
