import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { HomeComponent } from './pages/home/home.component';
import { TierDetailsComponent } from './pages/tier-details/tier-details.component';
import { PaymentErrorComponent } from './pages/payment-error/payment-error.component';
import { ItinerarySetupComponent } from './pages/itinerary-setup/itinerary-setup.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ViewItineraryComponent } from './pages/view-itinerary/view-itinerary.component';
import { authGuard } from './services/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    // canActivate:[authGuard]
  },
  {
    path: 'tier',
    component: TierDetailsComponent,
    // canActivate:[authGuard]
  },
  {
    path: 'payment/error',
    component: PaymentErrorComponent,
    // canActivate:[authGuard]
  },
  {
    path: 'create-itinerary',
    component: ItinerarySetupComponent,
    // canActivate:[authGuard]
  },
  {
    path: 'view-itinerary/:itineraryId',
    component: ViewItineraryComponent,
    // canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
