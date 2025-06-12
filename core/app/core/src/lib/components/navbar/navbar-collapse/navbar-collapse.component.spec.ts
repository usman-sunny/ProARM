import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarCollapseComponent } from './navbar-collapse.component';

describe('NavbarCollapseComponent', () => {
  let component: NavbarCollapseComponent;
  let fixture: ComponentFixture<NavbarCollapseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarCollapseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarCollapseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
