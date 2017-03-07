import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';

import {QueueComponent} from './queue';
import {QueueItemComponent} from './queue-item';

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  declarations: [
    QueueItemComponent,
    QueueComponent
  ],
  exports: [
    QueueComponent
  ]
})
export class QueueModule {}