import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaPatientsComponent } from './alta-patients.component';

describe('AltaPatientsComponent', () => {
  let component: AltaPatientsComponent;
  let fixture: ComponentFixture<AltaPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltaPatientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltaPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
