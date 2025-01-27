import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosProfesionalesComponent } from './datos-profesionales.component';

describe('DatosProfesionalesComponent', () => {
  let component: DatosProfesionalesComponent;
  let fixture: ComponentFixture<DatosProfesionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosProfesionalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
