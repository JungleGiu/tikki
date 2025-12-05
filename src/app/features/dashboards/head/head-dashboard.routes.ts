import { Routes } from '@angular/router';
import { HeadDashboard as Dashboard } from './head-dashboard';
import { Kanban} from '../../kanban/kanban';
import { Tickets } from '../../tickets/tickets';
import { Teams } from '../../teams/teams';

export default [
  { path: '', component: Dashboard },
  { path: 'kanban', component: Kanban },
  { path: 'tickets', component: Tickets },
  { path: 'teams', component: Teams },
] as Routes;