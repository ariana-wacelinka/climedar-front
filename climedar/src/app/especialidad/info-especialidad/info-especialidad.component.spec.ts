import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoEspecialidadComponent } from './info-especialidad.component';

describe('InfoEspecialidadComponent', () => {
  let component: InfoEspecialidadComponent;
  let fixture: ComponentFixture<InfoEspecialidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoEspecialidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
