import { inject, Injectable } from "@angular/core";

import { environment } from '@env/environment';
import { Role } from "../model/role";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class RolesService {

    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    async getRoles(): Promise<Role[]> {
        try {
            const response = await firstValueFrom(this.http.get<Role[]>(`${this.apiUrl}/roles`));
            // console.log(response);
            return response ? response : [];
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            return [];
        }
    }
}