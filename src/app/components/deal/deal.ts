import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-deal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './deal.html',
  styleUrl: './deal.scss',
})
export class Deal {
  @Input() deal: any;
}
