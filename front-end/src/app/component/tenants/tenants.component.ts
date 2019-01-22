import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { RealEstate } from './../../model/real.estate.model';
import { IAppState } from 'app/store/state';
import { NgRedux } from '@angular-redux/store';
import { TenantsService, TenantWish } from './../../service/tenants.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Renderer2, ViewChild, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { EstateService } from '../../service/estate.service';
import { PopupService } from '../../service/popup.service';
import { CREATE_REAL_ESTATE } from 'app/store/actions';
import { UserActionService } from 'app/service/user.action.service';


@Component({
    selector: 'app-tenants',
    templateUrl: './tenants.component.html',
    styleUrls: ['./tenants.component.css']
})
export class TenantsComponent implements OnInit, OnDestroy, AfterViewInit {
    form: FormGroup;
    wishes: TenantWish[];
    totalWishes: number;
    loading: boolean;
    public mapCoords: any = {
        lat: 50.450788801336145,
        long: 30.521750883341735
    }
    lat = 50.450788801336145;
    long = 30.521750883341735
    searchParams: any = {
        countryCode: 'UA',
        distance: 15,
        distanceUnit: 'km',
        pageSize: 99999,
    };
    status: string;
    estates: RealEstate[];
    estateId: number;
    wishId: number;
    sendedWishes: string[];
    loadingMap: boolean;
    offeredPrice: any;
    newPrice: any;
    protected map: any;
    hideForeverModel: boolean;
    @ViewChild("offerModal") offerModal;
    @ViewChild("infoModal") infoModal;

    constructor(
        private fb: FormBuilder,
        private tenatnsService: TenantsService,
        private renderer: Renderer2,
        private ngRedux: NgRedux<IAppState>,
        private estateService: EstateService,
        private changeRef: ChangeDetectorRef,
        private popupService: PopupService,
        private router: Router,
        private cookieService: CookieService,
        private translateService: TranslateService,
        private userActionService: UserActionService
    ) { }

    getTenantsWishes() {
        this.loadingMap = true;
        this.tenatnsService.getTenantsWishes(this.searchParams)
            .then((res) => {
                this.wishes = res.wishes;
                this.totalWishes = res.totalWishes;
                this.loadingMap = false;
            })
            .catch(() => {
                this.loadingMap = false;
            })
    }

    search() {
        this.searchParams.latitude = this.mapCoords.lat;
        this.searchParams.longitude = this.mapCoords.long;
        this.searchParams = Object.assign({}, this.searchParams, this.form.value);
        this.getTenantsWishes()
    }

    boundsChange(event: any) {
        this.searchParams.bottomRightLatitude = event.j.l;
        this.searchParams.topLeftLongitude = event.j.j;
        this.searchParams.topLeftLatitude = event.l.l;
        this.searchParams.bottomRightLongitude = event.l.j;
    }

    geoBoxChange() {
        if (this.map) {
            const center = this.map.getCenter();
            this.mapCoords.lat = center.lat();
            this.mapCoords.long = center.lng();
        }
        this.search();
    }


    createNewEstate() {
        if (this.ngRedux.getState().session.isAuthenticated) {
            if (!this.ngRedux.getState().session.currentUser.emailConfirmed || !this.ngRedux.getState().session.currentUser.phoneConfirmed) {
                this.popupService.popupError.next('NeedConfirmError');
            } else {
                this.ngRedux.dispatch({ type: CREATE_REAL_ESTATE });
                this.router.navigateByUrl('/home/estate/general');
            };
        } else {
            this.router.navigateByUrl('/login');
        }
    }

    checkUserStatusForOffer() {
        if (!this.ngRedux.getState().session.isAuthenticated) {
            this.status = 'unknown';
            this.changeRef.detectChanges();
        } else {
            this.estateService.getUserEstates()
                .then((res) => {
                    this.estates = res;
                    if (!this.estates.length) {
                        this.status = 'withoutEstate';
                    } else if (this.estates.every((estate) => { return estate.status === 'OFFLINE' })) {
                        this.status = 'offline';
                    } else {
                        let onlineEstates = this.estates.filter((estate) => estate.status === 'ONLINE')
                        if (onlineEstates.every((estate) => { return estate.moderated === false })) {
                            this.status = 'unModerated';
                        } else {
                            this.status = 'list';
                        }
                    }
                    this.changeRef.detectChanges();
                })
        }
    }

    offerEstateForWish() {
        this.tenatnsService.offerEstataeForWish(this.wishId, this.estateId, this.newPrice)
            .then(() => {
                this.newPrice = '';
                this.status = 'success';
                const wishId = this.wishId.toString();
                const wishesId = this.cookieService.get('wishId').split(',') || [];
                if (wishesId.indexOf(wishId) === -1)
                    wishesId.push(wishId);
                this.cookieService.set('wishId', wishesId.join(), 7, '/');
                this.changeRef.detectChanges();

            })
            .catch(() => {
                this.hideOfferModal();
            })
    }

    changePrice(type: string) {
        if (/^\d+$/.test(this[`${type}Price`]) === false) {
            this[`${type}Price`] = '';
        }
    }

    resetForm() {
        this.form.reset({
            rentFor: '',
            accommodation: '',
            estateType: '',
            offeredPrice: ''
        });
        this.search();
    }

    estateClickHandler(id: number) {
        this.estateId = id;
        this.changeRef.detectChanges();
    }

    isWishAlreadySanded(id) {
        return this.sendedWishes.indexOf(id + '') !== -1;
    }

    getMakerLabel() {
        return this.translateService.currentLang === 'uk' ? 'Орендар' : 'Арендатор';
    }

    showOfferModal(id?: number) {
        this.userActionService.sendUserAction({ 'landlord': 'try make offer' }, true);
        this.openModal(this.offerModal)
        this.wishId = id;
        this.checkUserStatusForOffer();
    }

    hideOfferModal() {
        this.hideModal(this.offerModal);
        this.status = '';
        this.estateId = null;
        this.wishId = null;
    }

    showInfoModal() {
        this.openModal(this.infoModal);
    }

    hideInfoModal() {
        if (this.hideForeverModel) {
            localStorage.setItem('tenantInfo', 'true')
        }
        this.hideModal(this.infoModal);
    }

    openModal(modal) {
        this.renderer.addClass(modal.nativeElement, 'show-modal');
        this.renderer.addClass(modal.nativeElement.querySelector('.modal-inner'), 'show-modal-inner');
        this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
    }

    hideModal(modal) {
        this.renderer.removeClass(modal.nativeElement, 'show-modal');
        this.renderer.removeClass(modal.nativeElement.querySelector('.modal-inner'), 'show-modal-inner');
        this.renderer.setStyle(document.body, 'overflow-y', 'auto');
    }

    trackByFn(index, item) {
        return item.id;
    }

    mapReady(map) {
        this.map = map;
    }

    onMarkerClick() {
        this.userActionService.sendUserAction({ 'landlord': 'look details' }, true);
    }

    ngOnInit() {
        (<any>window).scrollTo(0, 0);
        this.userActionService.sendUserAction({ 'landlord': 'search tenants' }, true);
        this.form = this.fb.group({
            rentFor: [''],
            accommodation: [''],
            estateType: [''],
            // roomsNumber: [''],
            offeredPrice: ['']
        })
        if (!localStorage.getItem('tenantInfo')) {
            this.showInfoModal();
        }
    }

    ngAfterViewInit() {
        this.sendedWishes = this.cookieService.get('wishId').split(',') || [];
    }

    ngOnDestroy() {
        if (this.offerModal) {
            this.hideOfferModal();
        }
        if (this.infoModal) {
            this.hideInfoModal();
        }
    }

}
