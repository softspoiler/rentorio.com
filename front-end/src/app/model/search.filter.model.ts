import { LeaseTerm } from './lease.term.enum';
import { Sorting } from "app/model/sorting.enum";

export class SearchFilter {
    private countryCode: string;
    private leaseTerm: string;
    private latitude: number;
    private longitude: number;
    private distance: number;
    private distanceUnit: string;
    private roomsNumber: number;
    private multiRoomsNumber: string;
    private totalAreaFrom: number;
    private totalAreaTo: number;
    private allowedHabitants: number;
    private accommodations: Set<string>;
    private priceMin: number;
    private priceMax: number;
    private bedroomsNumber: number;
    private bathroomsNumber: number;
    private bedsNumber: number;
    private properties: Set<number>;
    private estateTypes: Set<string>;
    private sorting: Sorting;
    private topLeftLatitude: number;
    private topLeftLongitude: number;
    private bottomRightLatitude: number;
    private bottomRightLongitude: number;
    private pageNumber: number;
    private pageSize: number;
    private totalPages: number;

    constructor() {
        this.countryCode = 'UA';
        this.leaseTerm = LeaseTerm[LeaseTerm.LONG];
        this.distance = 15;
        this.distanceUnit = 'km';
        this.pageSize = 10;
    }

    setParam(name: string, value: any) {
        this[name] = value;
    }

    getParamValue(name: string): any {
        return this[name];
    }

    removeParam(name: string) {
        this[name] = null;
    }

    getQueryParams(): Object {
        // let parts = [];
        let query = {};
        for (let param of Object.keys(this)) {
            if (this[param] !== null) {
                if (this[param].entries) {
                    query[param] = [];
                    this[param].forEach((value) => {
                        query[param].push(value);
                    });
                } else {
                    query[param] = this[param];
                }
            } else {
                continue;
            }
            // parts.push(param + '=' + this[param]);
        }
        return query;
        // return '?' + parts.join('&');
    }
}
