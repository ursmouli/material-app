import { Injectable } from "@angular/core";
import { Subject } from "rxjs";


@Injectable()
export class ProfileMenuService {
    private openProfileMenuSource = new Subject();
    openProfileMenu$ = this.openProfileMenuSource.asObservable();

    openProfileMenu = () => this.openProfileMenuSource.next('open');
}