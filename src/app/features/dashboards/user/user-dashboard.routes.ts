import { Routes } from '@angular/router';
import { UserDashboard as Dashboard } from './user-dashboard';

import { Tickets } from '../../tickets/tickets';

import { Kanban } from '../../kanban/kanban';

export default [
  { path: '', component: Dashboard },
  { path: 'tickets', component: Tickets },
  { path: 'kanban', component: Kanban },
] as Routes;