import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaDoctorComponent } from './alta-doctor.component';

describe('AltaDoctorComponent', () => {
  let component: AltaDoctorComponent;
  let fixture: ComponentFixture<AltaDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltaDoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltaDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
