import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgModule, OnChanges, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


@Component({
  selector: 'fast-date-typing',
  template: `
    <div class="datetime-edit" datetimeformat="M/d/yyyy">
      <div class="datetime-edit-fields-wrapper" (mousemove)="moveMouse()" (click)="moveMouse()">
        <span #yearInput role="spinbutton" aria-placeholder="yyyy" aria-valuemin="1000" aria-valuemax="9999" aria-label="Year" tabindex="0" (focus)="temp = null" (blur)="yearBlur()" (keydown)="yearSet($event)">
          {{yearValue}}
        </span>
        <div>{{separator}}</div>
        <span #monthInput role="spinbutton" aria-placeholder="mm" aria-valuemin="1" aria-valuemax="12" aria-label="Month" tabindex="0" (focus)="temp = null" (blur)="selectionChange.emit(yearValue + '-' + monthValue + '-' + dayValue)" (keydown)="monthSet($event)">
          {{monthValue}}
        </span>
        <div>{{separator}}</div>
        <span #dayInput role="spinbutton" aria-placeholder="dd" aria-valuemin="1" aria-valuemax="31" aria-label="Day" tabindex="0" (focus)="temp = null" (blur)="selectionChange.emit(yearValue + '-' + monthValue + '-' + dayValue)" (keydown)="daySet($event)">
          {{dayValue}}
        </span>
      </div>
    </div>
`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./fast-date-typing.scss']
})
export class DateInput implements OnChanges{


yearBlur(){
  (+this.yearValue == 0) ? this.yearValue = '0001' : ''
  this.selectionChange.emit(this.yearValue + '-' + this.monthValue + '-' + this.dayValue);
}

  pesian = true;
  @Input() separator = '/';

  @ViewChild('yearInput') yearInputViewChild: ElementRef<HTMLElement>;
  @ViewChild('monthInput') monthInputViewChild: ElementRef<HTMLElement>;
  @ViewChild('dayInput') dayInputViewChild: ElementRef<HTMLElement>;

  @Output() selectionChange: EventEmitter<string> = new EventEmitter();
  @Input() selection = 'yyyy-mm-dd';
  yearValue = 'yyyy';
  monthValue = 'mm';
  dayValue = 'dd';
  ngOnChanges(changes: SimpleChanges): void {
    this.yearValue = this.selection.split('-')[0];
    this.monthValue = this.selection.split('-')[1];
    this.dayValue = this.selection.split('-')[2];
  }
  // this.year = new YearControl({ value: '', disabled: false }, [Validators.pattern(/^(13|14)\d\d$/)]);
  // this.month = new MonthControl({ value: '', disabled: false }, [Validators.pattern(/^(0[1-9]|1[0-2])$/)]);
  // this.day = new DayControl({ value: '', disabled: false }, [Validators.pattern(/^(0[1-9]|1[0-2])$/)]);

  // selectAll(element: HTMLElement) {
  //   let selection = window.getSelection();
  //   let range = document.createRange();
  //   range.selectNodeContents(element);
  //   selection.removeAllRanges();
  //   selection.addRange(range);
  // }

  moveMouse() {
    window.getSelection().removeAllRanges();
  }

  focusOnYear() {
    this.yearInputViewChild.nativeElement.focus();
  }

  focusOnMonth() {
    this.monthInputViewChild.nativeElement.focus();
  }

  focusOnDay() {
    this.dayInputViewChild.nativeElement.focus();
  }

  afterDayFocus() {
    this.dayInputViewChild.nativeElement.blur();
  }

  beforeYearFocus() {
    this.yearInputViewChild.nativeElement.blur();
  }

  temp: string;

  yearSet(evt: KeyboardEvent) {
    let inputNumber = evt.key;
    switch (inputNumber) {
      case 'ArrowUp':
        if (!isNaN(+this.yearValue) && +this.yearValue != 9999) {
          this.yearValue = (+this.yearValue + 1).toString().padStart(4, '0');
          if (this.pesian) {
            this.checkDayPersianRule(this.dayValue[1]);
          }
        }
        break;
      case 'ArrowDown':
        if (!isNaN(+this.yearValue) && +this.yearValue != 1) {
          this.yearValue = (+this.yearValue - 1).toString().padStart(4, '0');
          if (this.pesian) {
            this.checkDayPersianRule(this.dayValue[1]);
          }
        }
        break;
      case 'ArrowRight':
        this.focusOnMonth();
        break;
      case 'ArrowLeft':
        this.beforeYearFocus();
        break;
    }
    if (!/^\d+$/.test(inputNumber)) {
      return;
    }
    if (this.temp == null) {
      this.yearValue = '000' + inputNumber;
      this.temp = inputNumber;
    } else {
      switch (this.temp.length) {
        case 1:
          this.yearValue = '00' + this.temp + inputNumber;
          this.temp = this.temp + inputNumber;
          break;
        case 2:
          this.yearValue = '0' + this.temp + inputNumber;
          this.temp = this.temp + inputNumber;
          break;
        case 3:
          this.yearValue = this.temp + inputNumber;
          if (this.yearValue == '0000') {
            this.yearValue = '0001';
          }
          if (this.pesian) {
            this.checkDayPersianRule(inputNumber);
          }
          this.temp = null;
          this.focusOnMonth();
          break;

      }
    }
  }

  monthSet(evt: KeyboardEvent) {
    let inputNumber = evt.key;
    switch (inputNumber) {
      case 'ArrowUp':
        if (!isNaN(+this.monthValue) && +this.monthValue != 12) {
          this.monthValue = (+this.monthValue + 1).toString().padStart(2, '0');
          if (this.pesian) {
            this.checkDayPersianRule(this.dayValue[1]);
          }
        }
        break;
      case 'ArrowDown':
        if (!isNaN(+this.monthValue) && +this.monthValue != 1) {
          this.monthValue = (+this.monthValue - 1).toString().padStart(2, '0');
          if (this.pesian) {
            this.checkDayPersianRule(this.dayValue[1]);
          }
        }
        break;
      case 'ArrowRight':
        this.focusOnDay();
        break;
      case 'ArrowLeft':
        this.focusOnYear();
        break;
    }
    if (!/^\d+$/.test(inputNumber)) {
      return;
    }
    if (this.temp == null) {
      this.monthValue = '0' + ((inputNumber == '0') ? '1' : inputNumber);
      (+inputNumber < 2) ? this.temp = inputNumber : this.focusOnDay();
    } else {
      if (this.temp == '0') {
        this.monthValue = '0' + ((inputNumber == '0') ? '1' : inputNumber);
      } else if (+inputNumber > 2) {
        this.monthValue = '0' + inputNumber;
      } else {
        this.monthValue = this.temp + inputNumber;
      }
      this.temp = null;
      this.focusOnDay();
    }
    if (this.pesian) {
      this.checkDayPersianRule(inputNumber);
    }

  }
  checkDayPersianRule(inputNumber: string) {
    if (+this.dayValue > 29) {
      if (this.monthValue == '12' && +this.yearValue % 4 != 2) {
        this.dayValue = '29';
      } else if (inputNumber == '1' && +this.monthValue > 6) {
        this.dayValue = '30';
      }
    }
  }

  daySet(evt: KeyboardEvent) {
    let inputNumber = evt.key;
    switch (inputNumber) {
      case 'ArrowUp':
        if (!isNaN(+this.dayValue) && +this.dayValue != 31) {
          this.dayValue = (+this.dayValue + 1).toString().padStart(2, '0');
          if (this.pesian) {
            this.checkDayPersianRule(this.dayValue[1]);
          }
        }
        break;
      case 'ArrowDown':
        if (!isNaN(+this.dayValue) && +this.dayValue != 1) {
          this.dayValue = (+this.dayValue - 1).toString().padStart(2, '0');
          if (this.pesian) {
            this.checkDayPersianRule(this.dayValue[1]);
          }
        }
        break;
      case 'ArrowRight':
        this.afterDayFocus();
        break;
      case 'ArrowLeft':
        this.focusOnMonth();
        break;
    }

    if (!/^\d+$/.test(inputNumber)) {
      return;
    }
    if (this.temp == null) {
      this.dayValue = '0' + ((inputNumber == '0') ? '1' : inputNumber);
      (+inputNumber < 4) ? this.temp = inputNumber : this.afterDayFocus();
    } else {
      if (this.temp == '3') {
        if (+inputNumber > 1) {
          this.dayValue = '0' + inputNumber;
        } else {
          this.dayValue = this.temp + inputNumber;
          if (this.pesian) {
            if (this.monthValue == '12' && +this.yearValue % 4 != 2) {
              this.dayValue = '29';
            } else if (inputNumber == '1' && +this.monthValue > 6) {
              this.dayValue = '30';
            }
          }

        }
      } else {
        this.dayValue = (this.temp + inputNumber == '00') ? '01' : this.temp + inputNumber;
      }
      this.temp = null;
      this.afterDayFocus();
    }
  }

  checkMonthAndKabiseh() {

  }

}

@NgModule({
  declarations: [
    DateInput
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    DateInput
  ]
})
export class FastDateTyping { }
