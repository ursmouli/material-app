import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export function ageBeforeValidator(maxDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const selectedDate = new Date(control.value);

        if (!control.value) {
            return null;
        }

        return selectedDate > maxDate ? { 'tooYoung': { value: control.value }} : null;
    };
}