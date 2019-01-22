import { UploadedImage } from './uploaded.image.model';
import { EstateProperty } from './estate.property.model';
import { Address } from './address.model';
import { EstateType } from './estate.type.enum';
import { Accommodation } from './accommodation.enum';
import { DepositType } from './deposit.type.enum';
import { UtilitiesPaymentType } from './utilities.payment.type.enum';
import { EstateStatus } from './estate.status.enum';
import { LeaseTerm } from './lease.term.enum';

export class RealEstate {
    id: number;
    publicPhoneNumber: string;
    type: EstateType;
    accommodation: Accommodation;
    allowedHabitants: number;
    roomsNumber: number;
    bedroomsNumber: number;
    bathroomsNumber: number;
    totalArea: number;
    livingArea: number;
    kitchenArea: number;
    floor: number;
    floors: number;
    shortDescription: string;
    description: string;
    address: Address;
    latitude: number;
    longitude: number;
    estateProperties: Set<number>;
    photos: Array<UploadedImage>;
    price: number;
    depositType: DepositType;
    utilitiesPaymentType: UtilitiesPaymentType;
    currency: string;
    status: EstateStatus | string;
    leaseTerm: LeaseTerm = LeaseTerm.LONG;
    moderated?: boolean;
}
