import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosDireccionComponent } from './datos-direccion.component';

describe('DatosDireccionComponent', () => {
  let component: DatosDireccionComponent;
  let fixture: ComponentFixture<DatosDireccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosDireccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosDireccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
