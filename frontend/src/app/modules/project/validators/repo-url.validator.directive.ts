// import { Directive } from '@angular/core';
// import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

// @Directive({
//   selector: '[appUserNameValidator]',
//   providers: [{ provide: NG_VALIDATORS, useExisting: RepoUrlValidatorDirective, multi: true }]

// })
// export class RepoUrlValidatorDirective implements Validator {

//   constructor() { }

//   validate(control: AbstractControl): { [key: string]: any } | null {
//     return this.validateRepoUrl(control.value) ? null : { url: 'Repositoty url is not valid' };
//   }

//   validateRepoUrl(userName: string): boolean {
//     let specialCharacters = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
//     return !specialCharacters.test(userName);
//   }
// }
