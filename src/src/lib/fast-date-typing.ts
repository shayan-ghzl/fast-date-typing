import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgModule, OnChanges, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'fast-date-typing',
  template: `
    <div class="datetime-edit" datetimeformat="M/d/yyyy">
      <div class="datetime-edit-fields-wrapper" (mousemove)="moveMouse()" (click)="moveMouse()">
        <div>
          <span #yearInput role="spinbutton" contentEditable="true" aria-placeholder="yyyy" aria-valuemin="1000" aria-valuemax="9999" aria-label="Year" tabindex="0" (focus)="spanFocus()" (blur)="setValue()" (keydown)="yearSet($event)">
            {{yearValue}}
          </span>
        </div>
        <div class="separator">{{separator}}</div>
        <div>
          <span #monthInput role="spinbutton" contentEditable="true" aria-placeholder="mm" aria-valuemin="1" aria-valuemax="12" aria-label="Month" tabindex="0" (focus)="spanFocus()" (blur)="setValue()" (keydown)="monthSet($event)">
            {{monthValue}}
          </span>
        </div>
        <div class="separator">{{separator}}</div>
        <div>
          <span #dayInput role="spinbutton" contentEditable="true" aria-placeholder="dd" aria-valuemin="1" aria-valuemax="31" aria-label="Day" tabindex="0" (focus)="spanFocus()" (blur)="setValue()" (keydown)="daySet($event)">
            {{dayValue}}
          </span>
        </div>
      </div>
    </div>
`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./fast-date-typing.scss'],
  host: {
    '[class.datetime-focused]': 'datetimeFocused',
    'tabindex': '0'
  }
})
export class DateInput implements OnChanges {

  @ViewChild('yearInput') yearInputViewChild!: ElementRef<HTMLElement>;
  @ViewChild('monthInput') monthInputViewChild!: ElementRef<HTMLElement>;
  @ViewChild('dayInput') dayInputViewChild!: ElementRef<HTMLElement>;

  @Input() separator = '-';
  @Input() value = 'yyyy-mm-dd';
  @Output() valueChange: EventEmitter<string> = new EventEmitter();

  yearValue = 'yyyy';
  monthValue = 'mm';
  dayValue = 'dd';
  datetimeFocused = false;
  temp = '';


  ngOnChanges(changes: SimpleChanges): void {
    let val = this.value.split(this.separator);
    this.yearValue = val[0];
    this.monthValue = val[1];
    this.dayValue = val[2];
  }

  setValue() {
    this.datetimeFocused = false;
    this.valueChange.emit(this.yearValue + '-' + this.monthValue + '-' + this.dayValue)
  }

  spanFocus() {
    this.temp = '';
    this.datetimeFocused = true;
  }

  moveMouse() {
    window.getSelection()?.removeAllRanges();
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
    // this.dayInputViewChild.nativeElement.blur();
  }

  beforeYearFocus() {
    // this.yearInputViewChild.nativeElement.blur();
  }


  yearSet(evt: KeyboardEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    let inputNumber = evt.key;
    switch (inputNumber) {
      case 'ArrowUp':
        if (this.yearValue != '9999' && !isNaN(+this.yearValue)) {
          this.yearValue = (+this.yearValue + 1).toString().padStart(4, '0');
        }
        break;
      case 'ArrowDown':
        if (this.yearValue != '0001' && !isNaN(+this.yearValue)) {
          this.yearValue = (+this.yearValue - 1).toString().padStart(4, '0');
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
    if (this.temp.length != 3) {
      if (+this.temp == 0 && inputNumber == '0') {
        this.yearValue = '0001';
      } else {
        this.yearValue = (this.temp + inputNumber).toString().padStart(4, '0');
      }
      this.temp = this.temp + inputNumber;
    } else {
      if (+this.temp == 0) {
        if (inputNumber == '0') {
          this.yearValue = '0001';
        } else {
          this.yearValue = '000' + inputNumber;
        }
      } else {
        this.yearValue = this.temp + inputNumber;
      }
      this.temp = '';
      this.focusOnMonth();
    }

  }

  monthSet(evt: KeyboardEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    let inputNumber = evt.key;
    switch (inputNumber) {
      case 'ArrowUp':
        if (this.monthValue != '12' && !isNaN(+this.monthValue)) {
          this.monthValue = (+this.monthValue + 1).toString().padStart(2, '0');
        }
        break;
      case 'ArrowDown':
        if (this.monthValue != '01' && !isNaN(+this.monthValue)) {
          this.monthValue = (+this.monthValue - 1).toString().padStart(2, '0');
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
    if (this.temp == '') {
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
      this.temp = '';
      this.focusOnDay();
    }
  }

  daySet(evt: KeyboardEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    let inputNumber = evt.key;
    switch (inputNumber) {
      case 'ArrowUp':
        if (this.dayValue != '31' && !isNaN(+this.dayValue)) {
          this.dayValue = (+this.dayValue + 1).toString().padStart(2, '0');
        }
        break;
      case 'ArrowDown':
        if (this.dayValue != '01' && !isNaN(+this.dayValue)) {
          this.dayValue = (+this.dayValue - 1).toString().padStart(2, '0');
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
    if (this.temp == '') {
      this.dayValue = '0' + ((inputNumber == '0') ? '1' : inputNumber);
      (+inputNumber < 4) ? this.temp = inputNumber : this.afterDayFocus();
    } else {
      if (this.temp == '3') {
        if (+inputNumber > 1) {
          this.dayValue = '0' + inputNumber;
        } else {
          this.dayValue = this.temp + inputNumber;
        }
      } else {
        this.dayValue = (this.temp + inputNumber == '00') ? '01' : this.temp + inputNumber;
      }
      this.temp = '';
      this.afterDayFocus();
    }
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
}

@NgModule({
  declarations: [
    DateInput
  ],
  imports: [
  ],
  exports: [
    DateInput
  ]
})
export class FastDateTyping { }
