import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPaqueteComponent } from './dialog-paquete.component';

describe('DialogPaqueteComponent', () => {
  let component: DialogPaqueteComponent;
  let fixture: ComponentFixture<DialogPaqueteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogPaqueteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPaqueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
