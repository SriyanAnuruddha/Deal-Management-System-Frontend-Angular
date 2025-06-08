import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // Router is not strictly needed for routerLink, but RouterLink is.

@Component({
  selector: 'app-admin-deal',
  standalone: true,
  imports: [CommonModule, RouterLink], // Ensure RouterLink is imported
  templateUrl: './admin-deal.html',
  styleUrl: './admin-deal.scss',
})
export class AdminDeal {
  @Input() deal: any;
  @Output() deleteClicked = new EventEmitter<string>();

  onDeleteClick(): void {
    if (this.deal && this.deal.id) {
      this.deleteClicked.emit(this.deal.id);
    } else {
      console.error('Attempted to delete a deal without a valid ID.');
    }
  }

  onViewDetailsClick(): void {}

  // This method is no longer needed as routerLink handles the navigation directly
  // onUpdateDealClick(): void {}
}
