import { Routes } from "@angular/router";
import { Dashboard } from "./dashboard";
import { Tools } from "./views/tools/tools";
import { Tickets } from "./views/tickets/tickets";
import { Teams } from "./views/teams/teams";

export default [
    { path: '', component: Dashboard },
    { path: 'tools', component: Tools },
    { path: 'tickets', component: Tickets },
    { path: 'teams', component: Teams },
] as Routes;