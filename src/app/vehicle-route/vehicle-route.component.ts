import { Component, inject, OnInit, AfterViewInit, signal, Inject } from '@angular/core';
import { VehicleRouteService } from '../common/services/vehicle-route.service';
import { VehicleRoute } from '../common/model/transport-models';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { VehicleService } from '../common/services/vehicle.service';
import { GoogleMapsModule } from '@angular/google-maps';
import { Router } from '@angular/router';

declare global {
  interface Window {
    google: any;
  }
}

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    GoogleMapsModule,
  ],
  templateUrl: './vehicle-route.component.html',
  styleUrl: './vehicle-route.component.scss'
})
export class VehicleRouteComponent implements OnInit {

  routeService = inject(VehicleRouteService);
  vehicleService = inject(VehicleService);

  routesDataSource = new MatTableDataSource<VehicleRoute>();
  displayedColumns: string[] = ['name', 'description', 'vehicle', 'actions'];
  

  // Use Signals for center and zoom
  center = signal<google.maps.LatLngLiteral>({ lat: 40.73, lng: -73.93 });
  zoom = signal(12);

  router = inject(Router);

  // Map options
  options: google.maps.MapOptions = {
    mapId: 'YOUR_MAP_ID', // Required for Advanced Markers
    disableDefaultUI: false,
    scrollwheel: true,
  };

  ngOnInit() {
    this.routeService.getRoutes().then((routes) => {
      this.routesDataSource.data = routes;
    });
  }

  viewMap() {
    this.center.set({ lat: 3.101442198695739, lng: 101.67614379533345 });
    this.zoom.set(15);
  }

  // 3.101442198695739, 101.67614379533345 - SouthBank, Kuala Lumpur

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.center.set(event.latLng.toJSON());
    }
  }
  
  addRoute() {
    this.router.navigate(['/admin/routes/add']);
  }

}
