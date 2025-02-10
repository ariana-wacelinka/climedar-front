import { TestBed } from '@angular/core/testing';

import { ServiciosMedicosService } from './servicios-medicos.service';

describe('ServiciosMedicosService', () => {
  let service: ServiciosMedicosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosMedicosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
