import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDealPage } from './add-deal-page';

describe('AddDealPage', () => {
  let component: AddDealPage;
  let fixture: ComponentFixture<AddDealPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDealPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDealPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
