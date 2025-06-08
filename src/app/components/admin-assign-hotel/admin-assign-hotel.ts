import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Hotel {
  id: string;
  name: string;
  rate: number;
  amenities: string;
  deals: null;
}

@Component({
  selector: 'app-admin-assign-hotel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-assign-hotel.html',
  styleUrl: './admin-assign-hotel.scss',
})
export class AdminAssignHotel implements OnInit {
  @Input() hotel!: Hotel;
  @Input() isInitiallyChecked: boolean = false;
  @Output() hotelAssigned = new EventEmitter<{
    hotelId: string;
    checked: boolean;
  }>();

  currentCheckedState: boolean = false;

  ngOnInit(): void {
    this.currentCheckedState = this.isInitiallyChecked;
  }

  onCheckboxChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.currentCheckedState = inputElement.checked;
    this.hotelAssigned.emit({
      hotelId: this.hotel.id,
      checked: this.currentCheckedState,
    });
  }
}
