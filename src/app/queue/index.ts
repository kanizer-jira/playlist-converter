import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { HttpModule }         from '@angular/http';
import { QueueComponent }     from './queue';
import { QueueService }       from './queue.service';
import { QueueItemComponent } from './queue-item';
import { BigButtonModule }    from '../button';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    BigButtonModule
  ],
  declarations: [
    QueueItemComponent,
    QueueComponent
  ],
  providers: [
    QueueService
  ],
  exports: [
    QueueComponent
  ]
})
export class QueueModule {}
