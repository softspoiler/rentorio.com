import { FormControl, Validators, AbstractControl } from '@angular/forms';

export default class Validations {

    public static emailValidation(val = ''): FormControl {
        return new FormControl(
            val,
            Validators.compose([
                Validators.required,
                Validators.pattern(/^[_A-Za-z0-9-+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/)
            ])
        );
    }

    public static passwordValidation(type: boolean): FormControl {
        if (!type) {
            return new FormControl('', Validators.required);
        } else {
            return new FormControl(
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(/^(?=.*[A-Za-z])((?=.*[0-9])|(?=.*[@#$%.!]))/),
                    Validators.minLength(8),
                    Validators.maxLength(50)
                ])
            );
        }
    }

    public static oldPasswordValidation(): FormControl {
        return new FormControl('', Validators.required);
    }

    public static confirmPasswordValidation(): FormControl {
        return new FormControl('', Validators.required);
    }

    public static firstNameValidation(): FormControl {
        return new FormControl('', Validators.required);
    }

    public static lastNameValidation(): FormControl {
        return new FormControl('', Validators.required);
    }

    public static phoneNumberValidation(): FormControl {
        return new FormControl(
            '', Validators.pattern('^[0-9]{7}$'));
    }

    public static termOfUseValidation(): FormControl {
        return new FormControl('', Validators.requiredTrue);
    }

    public static rememberMeValidation(): FormControl {
        return new FormControl('true');
    }

    public static passwordConfirming(c: AbstractControl) {
        if (c.get('password').value !== c.get('confirmPassword').value) {
            return { nomatch: true };
        }
    }
    public static textArea(): FormControl {
        return new FormControl('', Validators.required);
    }

    public static required(defaultValue: any = ''): FormControl {
        return new FormControl(defaultValue, Validators.required);
    }
}