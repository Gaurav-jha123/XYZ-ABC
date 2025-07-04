import { TestBed } from '@angular/core/testing';

import { OmniServerServiceService } from './omni-server-service.service';

describe('OmniServerServiceService', () => {
  let service: OmniServerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OmniServerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
