import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignHotels } from './assign-hotels';

describe('AssignHotels', () => {
  let component: AssignHotels;
  let fixture: ComponentFixture<AssignHotels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignHotels]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignHotels);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
