import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for safe navigation operator '?'

interface HotelData {
  id: string;
  name: string;
  rate: number;
  amenities: string;
  // Add other properties if your API returns them
}

@Component({
  selector: 'app-hotel',
  standalone: true,
  imports: [CommonModule], // Add CommonModule
  templateUrl: './hotel.html',
  styleUrl: './hotel.scss',
})
export class Hotel {
  @Input() hotel!: HotelData; // Input property to receive the hotel object
}
