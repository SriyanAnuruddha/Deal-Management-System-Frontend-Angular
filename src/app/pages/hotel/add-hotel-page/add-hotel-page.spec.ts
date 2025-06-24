import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHotelPage } from './add-hotel-page';

describe('AddHotelPage', () => {
  let component: AddHotelPage;
  let fixture: ComponentFixture<AddHotelPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHotelPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHotelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
