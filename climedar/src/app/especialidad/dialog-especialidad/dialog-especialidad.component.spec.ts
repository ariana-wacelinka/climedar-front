import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEspecialidadComponent } from './dialog-especialidad.component';

describe('DialogEspecialidadComponent', () => {
  let component: DialogEspecialidadComponent;
  let fixture: ComponentFixture<DialogEspecialidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEspecialidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
