import { Routes } from '@angular/router';
import { Dashboard } from './company-dashboard';
import { Tools } from './tools/tools';
import { Tickets } from './tickets/tickets';
import { Teams } from './teams/teams';

export default [
  { path: '', component: Dashboard },
  { path: 'tools', component: Tools },
  { path: 'tickets', component: Tickets },
  { path: 'teams', component: Teams },
] as Routes;
