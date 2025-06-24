import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDealPage } from './update-deal-page';

describe('UpdateDealPage', () => {
  let component: UpdateDealPage;
  let fixture: ComponentFixture<UpdateDealPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDealPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateDealPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
