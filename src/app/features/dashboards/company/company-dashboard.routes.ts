import { Routes } from '@angular/router';
import { CompanyDashboard as Dashboard } from './company-dashboard';
import { ChatPage } from '../../chat/chat';
import { Tickets } from '../../tickets/tickets';
import { Teams } from '../../teams/teams';

export default [
  { path: '', component: Dashboard },
  { path: 'tickets', component: Tickets },
  { path: 'teams', component: Teams },
  { path: 'chat', component: ChatPage },
] as Routes;
