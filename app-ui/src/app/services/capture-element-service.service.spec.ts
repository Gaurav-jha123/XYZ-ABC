import { TestBed } from '@angular/core/testing';

import { CaptureElementServiceService } from './capture-element-service.service';

describe('CaptureElementServiceService', () => {
  let service: CaptureElementServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaptureElementServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
