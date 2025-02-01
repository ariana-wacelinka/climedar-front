import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogServicioComponent } from './dialog-servicio.component';

describe('DialogServicioComponent', () => {
  let component: DialogServicioComponent;
  let fixture: ComponentFixture<DialogServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogServicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
