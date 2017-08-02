/*
 * Objservable/Subject collection
   - ReplaySubject allows for recurring handling

   SubjectService.get(key)
   .next(obj)
   .error(err)
   .complete();

   SubjectService.get(key)
   .subscribe(
     res => {
      // do stuff
     },
     err => {
      // handle error
     },
     _ => {
      // handle completion
     });
 */

import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class SubjectService {
  // Event store
  private static _subjects: { [ID: string]: ReplaySubject<any> } = {};

  // Return instance by ID or create if absent
  static get(ID: string): ReplaySubject<any> {
    if(!this._subjects[ID]) {
      this._subjects[ID] = new ReplaySubject();
    }
    return this._subjects[ID];
  }
}
