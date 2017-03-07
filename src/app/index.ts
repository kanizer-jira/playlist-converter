import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {routing, RootComponent} from './routes';

import {QueueModule} from './queue';

import {MainComponent} from './main';
import {TestRouteComponent} from './test-route';

// AppModule / Root Module ref:
// https://angular.io/docs/ts/latest/guide/appmodule.html
@NgModule({
  imports: [
    BrowserModule,
    routing,
    QueueModule // modules are imported vs. declared
  ],
  declarations: [
    RootComponent,
    MainComponent,
    TestRouteComponent
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}
