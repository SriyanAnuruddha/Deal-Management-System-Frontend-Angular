import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignHotelsDealsPage } from './assign-hotels-deals-page';

describe('AssignHotelsDealsPage', () => {
  let component: AssignHotelsDealsPage;
  let fixture: ComponentFixture<AssignHotelsDealsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignHotelsDealsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignHotelsDealsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
