import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../services/api.service';

interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-add-collaborators',
  templateUrl: './add-collaborators.component.html',
  styleUrls: ['./add-collaborators.component.scss']
})
export class AddCollaboratorsComponent implements OnInit {
  @Output() openCollaboratorForm = new EventEmitter<boolean>();
  users: User[] = [{id: 1, name: "aarin"},{id: 2, name: "jade"}];
  selectedUsers: User[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    // Fetch the users from the API
    // this.api.getUsers().subscribe((response: User[]) => {
    //   this.users = response;
    // });
  }

  onUserSelected(event: any): void {
    const selectedUser = event.value;
    if (!this.selectedUsers.includes(selectedUser)) {
      this.selectedUsers.push(selectedUser);
    }
  }

  removeUser(user: User): void {
    this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
  }

  onExitCollaboratorsForm(): void {
    this.openCollaboratorForm.emit(false);
  }
}
