import { Routes } from '@angular/router';
import { UserDashboard as Dashboard } from './user-dashboard';
import { Tickets } from '../../tickets/tickets';
import { Kanban } from '../../kanban/kanban';
import { ChatPage } from '../../chat/chat';

export default [
  { path: '', component: Dashboard },
  { path: 'tickets', component: Tickets },
  { path: 'kanban', component: Kanban },
  {path : 'chat', component: ChatPage}
] as Routes;