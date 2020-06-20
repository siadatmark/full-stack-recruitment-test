import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightDashboardComponent } from './flightDashboard.component';

const routes: Routes = [
  {
    path: '',
    component: FlightDashboardComponent,
    data: {
      title: 'Flight Dashboard'
    }
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
