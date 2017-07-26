import { NgModule }                from '@angular/core';
import { BrowserModule }           from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routing , RootComponent}  from './routes';

import { QueueModule }             from './queue';
import { InputModule }             from './input';

import { MainComponent }           from './main';
import { TestRouteComponent }      from './test-route';

// AppModule / Root Module ref:
// https://angular.io/docs/ts/latest/guide/appmodule.html
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    routing,
    QueueModule, // modules are imported vs. declared
    InputModule
  ],
  declarations: [
    RootComponent,
    MainComponent,
    TestRouteComponent
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}
