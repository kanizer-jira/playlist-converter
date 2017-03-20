import {Component, Input} from '@angular/core';
import {TestBed, async} from '@angular/core/testing';
import {MainComponent} from './main';

@Component({selector: 'cheap-thrills-input', template: ''})
class MockInputComponent {
  @Input() public playlistKey: string;
}
@Component({selector: 'cheap-thrills-queue', template: ''})
class MockQueueComponent {
  @Input() public playlistKey: string;
}

describe('Main Component', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainComponent,
        MockInputComponent,
        MockQueueComponent
      ]
    });
    TestBed.compileComponents();
  }));

  it('should render the input field and queue modules', () => {
    const fixture = TestBed.createComponent(MainComponent);
    fixture.detectChanges();
    const main = fixture.nativeElement;

    expect(main.querySelector('cheap-thrills-input')).toBeDefined();
    expect(main.querySelector('cheap-thrills-queue')).toBeDefined();
  });
});
