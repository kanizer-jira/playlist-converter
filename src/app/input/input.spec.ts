import {InputComponent} from './input';
import {TestBed, async} from '@angular/core/testing';

describe('input component', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InputComponent
      ]
    });
    TestBed.compileComponents();
  }));

  it('should render form elem', () => {
    const fixture = TestBed.createComponent(InputComponent);
    // fixture.componentInstance.queueItem = {
    //   title: 'Gulp',
    //   logo: 'http://fountainjs.io/assets/imgs/gulp.png',
    //   text1: 'The streaming build system',
    //   text2: 'Automate and enhance your workflow'
    // };
    fixture.detectChanges();
    const inputElem = fixture.nativeElement;
    expect(inputElem.querySelector('form').toBeDefined());
  });

  // TODO - test mock enpoint run

});
