import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class UsernameValidator {

    debouncer: NodeJS.Timeout;

    constructor(public userService: UserService) {

    }

    checkUsername(control: FormControl): any {

        clearTimeout(this.debouncer);

        return new Promise(resolve => {

            this.debouncer = setTimeout(() => {

                this.userService.validateUsername(control.value).subscribe((res) => {
                    if (res) {
                        resolve(null);
                    }
                    else {
                        resolve({ isExists: true });
                    }
                });
            }, 500);

        });
    }
}
