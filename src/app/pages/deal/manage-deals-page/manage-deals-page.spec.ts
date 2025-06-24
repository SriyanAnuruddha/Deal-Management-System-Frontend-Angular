import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDealsPage } from './manage-deals-page';

describe('ManageDealsPage', () => {
  let component: ManageDealsPage;
  let fixture: ComponentFixture<ManageDealsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageDealsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDealsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
