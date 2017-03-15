import 'core-js/client/shim'; // es6 shim
import 'zone.js/dist/zone'; // persistent async execution context...TODO - maybe read more later

import '@angular/common';
import 'rxjs'; // reactive tools - subscription approach to async patterns

import './index.scss';

import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app';

// TypeScript declarations required for some reserved words...
declare var process: any;
if (process.env.NODE_ENV === 'production') {
  enableProdMode();
} else {
  Error['stackTraceLimit'] = Infinity; // tslint:disable-line:no-string-literal
  require('zone.js/dist/long-stack-trace-zone'); // tslint:disable-line:no-var-requires
}

platformBrowserDynamic().bootstrapModule(AppModule);
