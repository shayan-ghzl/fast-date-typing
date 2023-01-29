import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FastDateTyping } from 'fast-date-typing';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FastDateTyping
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
