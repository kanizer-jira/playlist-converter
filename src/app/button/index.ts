import { NgModule }               from '@angular/core';
import { CommonModule }           from '@angular/common';
import { HttpModule }             from '@angular/http';
import { BigButtonComponent }     from './button';
import { BigButtonRingComponent } from './button-ring';

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  declarations: [
    BigButtonComponent,
    BigButtonRingComponent
  ],
  exports: [
    BigButtonComponent
  ]
})
export class BigButtonModule {}
