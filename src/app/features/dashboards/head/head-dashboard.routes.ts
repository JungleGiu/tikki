import { Routes } from '@angular/router';
import { HeadDashboard as Dashboard } from './head-dashboard';
import { Kanban} from '../../kanban/kanban';
import { Tickets } from '../../tickets/tickets';
import { Teams } from '../../teams/teams';
import { ChatPage } from '../../chat/chat';

export default [
  { path: '', component: Dashboard },
  { path: 'kanban', component: Kanban },
  { path: 'tickets', component: Tickets },
  { path: 'teams', component: Teams },
  { path: 'chat', component: ChatPage },
] as Routes;