import { User } from 'app/model/user.model';
import { Gender } from 'app/model/Gender.enum';
import { Locale } from 'app/model/Locale.enum';

export class UserProfile extends User {
    phoneNumber: string;
    gender: Gender;
    birthday: Date;
    selfDescription: string;
    placeOfWork: string;
    locale: Locale;
    placeOfEducation: string;
    isEmailConfirmed: boolean;
    registrationDate: Date;

    public get isPhoneNumberConfirmed(): boolean {
        return !!this.phoneNumber;
    }
}
