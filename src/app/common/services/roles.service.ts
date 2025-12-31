import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class RolesService {

    private roles: string[] = ['admin', 'user', 'guest'];
    
    getRoles(): Promise<string[]> {
        return Promise.resolve(this.roles);
    }
}