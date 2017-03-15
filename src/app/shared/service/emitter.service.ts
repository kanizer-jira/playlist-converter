/*
 * Event mediator/dispatcher
 */

// https://gist.github.com/sasxa
import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class EmitterService {
  // Event store
  private static _emitters: { [ID: string]: EventEmitter<any> } = {};

  // Return emitter by ID or create if absent
  static get(ID: string): EventEmitter<any> {
    if(!this._emitters[ID]) {
      this._emitters[ID] = new EventEmitter();
    }
    return this._emitters[ID];
  }
}
