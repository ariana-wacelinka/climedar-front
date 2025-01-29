import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogObrasocialComponent } from './dialog-obrasocial.component';

describe('DialogObrasocialComponent', () => {
  let component: DialogObrasocialComponent;
  let fixture: ComponentFixture<DialogObrasocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogObrasocialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogObrasocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
