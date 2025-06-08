import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHotel } from './admin-hotel';

describe('AdminHotel', () => {
  let component: AdminHotel;
  let fixture: ComponentFixture<AdminHotel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHotel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHotel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
