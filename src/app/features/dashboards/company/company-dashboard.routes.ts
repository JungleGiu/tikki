import { Routes } from '@angular/router';
import { CompanyDashboard as Dashboard } from './company-dashboard';

import { Tickets } from '../../tickets/tickets';
import { Teams } from '../../teams/teams';

export default [
  { path: '', component: Dashboard },
  { path: 'tickets', component: Tickets },
  { path: 'teams', component: Teams },
] as Routes;
