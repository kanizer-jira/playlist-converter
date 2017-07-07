import {MockBackend, MockConnection} from '@angular/http/testing';
import {Http, BaseRequestOptions, Response, ResponseOptions} from '@angular/http';
import {TestBed, inject, async} from '@angular/core/testing';
import { BigButtonRingComponent } from './button-ring';

describe('button ringcomponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BigButtonRingComponent
      ]
    });
    TestBed.compileComponents();
  }));

  // TODO - reflect correct state

  describe('BigButtonRingComponent rendering', () => {
    it('should render a display element', () => {
      const fixture = TestBed.createComponent(BigButtonRingComponent);
      const button = fixture.nativeElement;
      expect(button.querySelector('').textContent.trim()).toBe('Gulp');
    });
  });

});
