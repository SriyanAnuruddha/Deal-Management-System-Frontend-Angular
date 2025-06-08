import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAssignHotel } from './admin-assign-hotel';

describe('AdminAssignHotel', () => {
  let component: AdminAssignHotel;
  let fixture: ComponentFixture<AdminAssignHotel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAssignHotel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAssignHotel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
