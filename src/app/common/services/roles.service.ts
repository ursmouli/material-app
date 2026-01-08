import { Injectable } from "@angular/core";

import { environment } from '@env/environment';
import { Role } from "../model/role";


@Injectable({
    providedIn: 'root'
})
export class RolesService {

    private roles: string[] = ['admin', 'user', 'guest'];

    private apiUrl = environment.apiUrl;
    
    getRoles(): Promise<Role[]> {
        // return Promise.resolve(this.roles);

        return fetch(`${this.apiUrl}/roles`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => data.roles as Role[])
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                return [];
            });
    }
}