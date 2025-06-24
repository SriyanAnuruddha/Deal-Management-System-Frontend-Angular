import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateHotelPage } from './update-hotel-page';

describe('UpdateHotelPage', () => {
  let component: UpdateHotelPage;
  let fixture: ComponentFixture<UpdateHotelPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateHotelPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateHotelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
