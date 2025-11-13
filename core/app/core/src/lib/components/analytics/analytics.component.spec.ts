import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AnalyticsComponent} from './analytics.component';

describe('AnalyticsComponent', () => {
    let component: AnalyticsComponent;
    let fixture: ComponentFixture<AnalyticsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AnalyticsComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AnalyticsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize component', () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should handle cleanup on destroy', () => {
        spyOn(component['subs'], 'forEach');
        component.ngOnDestroy();
        expect(component['subs'].forEach).toHaveBeenCalled();
    });
}); 