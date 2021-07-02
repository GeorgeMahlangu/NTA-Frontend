import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WebScanPage } from './web-scan.page';

describe('WebScanPage', () => {
  let component: WebScanPage;
  let fixture: ComponentFixture<WebScanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebScanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WebScanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
