import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBoxDialogComponent } from './add-box-dialog.component';

describe('AddBoxDialogComponent', () => {
  let component: AddBoxDialogComponent;
  let fixture: ComponentFixture<AddBoxDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBoxDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddBoxDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
