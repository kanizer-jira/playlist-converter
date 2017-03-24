import {Component} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './main';
import {TestRouteComponent} from './test-route';

@Component({
  selector: 'cheapthrills-root',
  template: '<router-outlet></router-outlet>'
})
export class RootComponent {}

export const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'test-route',
    component: TestRouteComponent
  }
];

export const routing = RouterModule.forRoot(routes);
