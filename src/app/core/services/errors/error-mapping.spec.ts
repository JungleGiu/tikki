import { TestBed } from '@angular/core/testing';

import { ErrorMapping } from './error-mapping';

describe('ErrorMapping', () => {
  let service: ErrorMapping;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorMapping);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
