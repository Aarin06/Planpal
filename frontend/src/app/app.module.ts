import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { TripPreviewComponent } from './components/trip-preview/trip-preview.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiInterceptor } from './api.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {JsonPipe} from '@angular/common';

// Angular Material Imports
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import {MatGridListModule}  from '@angular/material/grid-list';


import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeComponent } from './pages/home/home.component';
import { IndexComponent } from './pages/index/index.component';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginPopupComponent } from './pages/login-popup/login-popup.component';
import { ItinerarySetupComponent } from './pages/itinerary-setup/itinerary-setup.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ViewItineraryComponent } from './pages/view-itinerary/view-itinerary.component';
import { PlaceAutocompleteComponent } from './components/place-autocomplete/place-autocomplete.component';
import { CustomEventFormComponent } from './components/custom-event-form/custom-event-form.component';
import { EventPreviewFormComponent } from './components/event-preview-form/event-preview-form.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    TripPreviewComponent,
    HomeComponent,
    IndexComponent,
    LandingComponent,
    LoginPopupComponent,
    ItinerarySetupComponent,
    CalendarComponent,
    ViewItineraryComponent,
    PlaceAutocompleteComponent,
    CustomEventFormComponent,
    EventPreviewFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FontAwesomeModule,
    JsonPipe,
    FullCalendarModule,
    MatGridListModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
