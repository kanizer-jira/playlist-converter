/**
 * Listen for window resize and dispatch changes to viewport
 */

// import { EmitterService }  from '../shared/service/emitter.service';
import { EventEmitter } from '@angular/core';

let _instance      : ViewportUtil;
const RETINA_QUERY : string = 'only screen and (-webkit-min-device-pixel-ratio: 1.5), screen and (min-resolution: 1.5dppx), screen and (min-resolution: 144dpi)';
const VIEWPORTS    : any = {
  small  : 480,
  medium : 950,
  large  : 1030
};

export class ViewportUtil extends EventEmitter<any> {

  static gi() {
    if(!_instance) {
      _instance = new ViewportUtil();
    }
    return _instance;
  }

  private currentViewport : string;
  private currentRetina   : boolean;
  private retinaQuery     : MediaQueryList;

  constructor() {
    super();
    this.registerListeners();
  }

  registerListeners() {
    window.addEventListener('resize', this.updateViewport.bind(this));
    window.addEventListener('orientationchange', this.updateViewport.bind(this));

    // setup retina listeners
    this.retinaQuery = window.matchMedia(RETINA_QUERY); // TODO - polyfill `matchMedia`
    this.updateRetina();
    if(this.retinaQuery.addListener) {
      this.retinaQuery.addListener(this.updateRetina);
    }
  }

  updateViewport() {
    // set flags and dispatch changes
    const lastViewport: string = this.currentViewport;
    this.currentViewport = this.getViewport();
    if(this.currentViewport !== lastViewport) {
      this.emit({ viewport: this.currentViewport });
    }
  }

  getViewport() {
    let viewport: string;
    const viewportWidth: number = document.documentElement.clientWidth || window.innerWidth;
    for(let key in VIEWPORTS) {
      if( viewportWidth <= VIEWPORTS[key]) {
        viewport = key;
        break;
      }
    }
    return viewport;
  }

  updateRetina() {
    // set flags and dispatch changes
    const lastRetina: boolean = this.currentRetina;
    this.currentRetina = this.retinaQuery.matches;

    if (lastRetina !== this.currentRetina) {
      this.emit({ retina: this.currentRetina });
    }
  }

}
