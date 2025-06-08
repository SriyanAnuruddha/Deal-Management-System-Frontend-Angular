import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-deal',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
}
