import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeal } from './admin-deal';

describe('AdminDeal', () => {
  let component: AdminDeal;
  let fixture: ComponentFixture<AdminDeal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDeal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDeal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
