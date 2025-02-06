import { ComponentFixture, TestBed } from '@angular/core/testing';

import { infoServicioComponent } from './info-servicio.component';

describe('SinfoServicioComponent', () => {
  let component: infoServicioComponent;
  let fixture: ComponentFixture<infoServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [infoServicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(infoServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
