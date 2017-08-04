import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { HttpModule }          from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { InputComponent }      from './input';

@NgModule({
  imports: [
    // dependency injection
    CommonModule,
    HttpModule,
    ReactiveFormsModule
  ],
  declarations: [
    InputComponent
  ],
  exports: [
    InputComponent
  ]
})
export class InputModule {}
