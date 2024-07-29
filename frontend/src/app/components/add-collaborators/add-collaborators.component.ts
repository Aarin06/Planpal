import { Component, OnInit, Output,Input, EventEmitter } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { user } from '../../classes/user';
import { ItineraryService } from '../../services/itinerary.service';

@Component({
  selector: 'app-add-collaborators',
  templateUrl: './add-collaborators.component.html',
  styleUrls: ['./add-collaborators.component.scss'],
})
export class AddCollaboratorsComponent implements OnInit {
  @Output() openCollaboratorForm = new EventEmitter<boolean>();
  @Input() itineraryId: number | null = null;

  users: user[] = [];
  selectedUsers: user[] = [];
  userSearchControl = new FormControl();
  filteredUsers: Observable<user[]> = of([]); // Initialize to an empty observable

  constructor(private api: ApiService, private itineraryApi: ItineraryService) {}

  ngOnInit(): void {
    this.fetchUsers();

    this.filteredUsers = this.userSearchControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? this._filterUsers(value) : this._filterUsers(''))
    );
  }

  fetchUsers(): void {
    // Fetch the users from the API
    this.api.getUsers().subscribe((response: any) => {
      this.users = response;
    });
    this.api.me().subscribe((user: user) => {
      if (this.itineraryId) {
        this.itineraryApi.getItineraryMembers(this.itineraryId).subscribe((response: any) => {
          this.selectedUsers = response.filter((member: any) => member.id !== user.id);
        });
      }
  });
  }

  private _filterUsers(value: string): user[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(user => user.username.toLowerCase().includes(filterValue));
  }

  onUserSelected(event: any): void {
    const user = event.option.value;
    if (user && !this.selectedUsers.includes(user)) {
      this.selectedUsers.push(user);
    }
    this.userSearchControl.setValue(''); // Clear the input field after selection
    if (this.itineraryId) {
      this.itineraryApi.addItineraryMember(user, this.itineraryId).subscribe({
      });
    }

  }

  removeUser(user: any): void {
    this.selectedUsers = this.selectedUsers.filter((u) => u.id !== user.id);
    if (this.itineraryId) {
      this.itineraryApi.removeItineraryMember(user.id, this.itineraryId).subscribe({
      });
    }
  }

  onExitCollaboratorsForm(): void {
    this.openCollaboratorForm.emit(false);
  }
}
