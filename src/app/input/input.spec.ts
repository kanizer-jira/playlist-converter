import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection }                         from '@angular/http/testing';
import { ReactiveFormsModule }                                 from '@angular/forms';
import { TestBed, async }                                      from '@angular/core/testing';
import { InputComponent }                                      from './input';
import { QueueService }                                        from '../queue/queue.service';

describe('InputComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        InputComponent
      ],
      providers: [
        // seems like recursive deps need to be added?!
        QueueService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
    TestBed.compileComponents();
  }));

  // pointless test to test testing...
  it('should render form elem', () => {
    const fixture = TestBed.createComponent(InputComponent);
    // fixture.detectChanges();
    const inputElem = fixture.nativeElement;
    expect(inputElem.querySelector('form')).toBeDefined();
  });

});
