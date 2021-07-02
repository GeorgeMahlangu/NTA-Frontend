import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TicketFormPage } from './ticket-form.page';

describe('TicketFormPage', () => {
  let component: TicketFormPage;
  let fixture: ComponentFixture<TicketFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
