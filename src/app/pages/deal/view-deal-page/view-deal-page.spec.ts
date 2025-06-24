import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDealPage } from './view-deal-page';

describe('ViewDealPage', () => {
  let component: ViewDealPage;
  let fixture: ComponentFixture<ViewDealPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDealPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDealPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
