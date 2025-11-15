import { Component, inject, OnInit ,signal} from '@angular/core';
import { CardModule } from 'primeng/card';
import { Button } from "primeng/button";
import { TableModule} from 'primeng/table';
import { Supabase } from '../../../../core/services/supabase';
import { User } from '../../../../core/models/user';
@Component({
  selector: 'app-teams',
  imports: [CardModule, Button, TableModule],
  templateUrl: './teams.html',
  styleUrl: './teams.scss',
})
export class Teams implements OnInit {

database = inject(Supabase)
users= signal<User[]>([])
isModalOpen : boolean = false

async ngOnInit() {
   try {
      const data = await this.database.getUsers();
      this.users.set(data)
      console.log('Utenti caricati:', this.users);
    } catch (err) {
      console.error('Errore nel caricamento:', err);
    }
}

openModal() {
  this.isModalOpen = true
}

closeModal() {
  this.isModalOpen = false
}

}
