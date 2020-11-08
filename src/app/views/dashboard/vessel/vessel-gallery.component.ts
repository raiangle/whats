import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {CdkDrag, CdkDropList, CdkDropListContainer, CdkDropListGroup, moveItemInArray} from '@angular/cdk/drag-drop';
import {FormBuilder} from '@angular/forms';
import {LoaderService, OptionService, Vessel_detailsService} from '../../services';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AppConstants} from '../../constants/app.constants';
import * as _ from 'lodash';


@Component({
    templateUrl: 'vessel-gallery.component.html',
})
export class VesselGalleryComponent implements AfterViewInit {
    @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
    @ViewChild(CdkDropList) placeholder: CdkDropList;

    public items = [];

    public target: CdkDropList;
    public targetIndex: number;
    public source: CdkDropListContainer;
    public sourceIndex: number;
    sub;
    private id;

    image_url = AppConstants.IMAGE_URL;

    vessel: any = {};
    orderData: any = {};

    constructor(private formBuilder: FormBuilder,
                private loaderService: LoaderService,
                private route: ActivatedRoute,
                public _http: HttpClient,
                public vesselDetailsService: Vessel_detailsService,
                public optionService: OptionService) {
        this.target = null;
        this.source = null;

        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id']; // (+) converts string 'id' to a number
        });
        if (this.id) {
            this.loaderService.display(true);


            this.vesselDetailsService.getVesselDetailsById(this.id).subscribe(response => {
                this.vessel = response;
                this.items = response.galleryimages;
                this.updateOrder(response.gallery_order);
                this.loaderService.display(false);
            }, error => {
                this.loaderService.display(false);
            });
        } else {
            this.loaderService.display(true);
            // this.addAdditionalFields();
            this.loaderService.display(false);
        }
    }

    updateOrder(order) {
        if (order === null) {
            return;
        }
        const sortArray = JSON.parse(order);
        this.items = _.sortBy(this.items, (item) => sortArray.indexOf(item.id));
    }


    ngAfterViewInit() {
        const phElement = this.placeholder.element.nativeElement;

        phElement.style.display = 'none';
        phElement.parentNode.removeChild(phElement);
    }

    saveGalleryOrder() {
        const itemsOrderToSave = [];
        for (const item of this.items) {
            itemsOrderToSave.push(item.id);
        }
        this.orderData.itemsOrderToSave = itemsOrderToSave;
        this.orderData.vessel_id = this.id;
        this.loaderService.display(true);
        this.vesselDetailsService.saveGallaryOrder(this.orderData).subscribe(response => {
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
    }

    drop() {
        if (!this.target) {
            return;
        }

        const phElement = this.placeholder.element.nativeElement;
        const parent = phElement.parentNode;

        phElement.style.display = 'none';

        parent.removeChild(phElement);
        parent.appendChild(phElement);
        parent.insertBefore(this.source.element.nativeElement, parent.children[this.sourceIndex]);

        this.target = null;
        this.source = null;

        if (this.sourceIndex !== this.targetIndex) {
            moveItemInArray(this.items, this.sourceIndex, this.targetIndex);
        }
    }

    enter = (drag: CdkDrag, drop: CdkDropList) => {
        if (drop === this.placeholder) {
            return true;
        }

        const phElement = this.placeholder.element.nativeElement;
        const dropElement = drop.element.nativeElement;

        const dragIndex = this.__indexOf(dropElement.parentNode.children, drag.dropContainer.element.nativeElement);
        const dropIndex = this.__indexOf(dropElement.parentNode.children, dropElement);

        if (!this.source) {
            this.sourceIndex = dragIndex;
            this.source = drag.dropContainer;

            const sourceElement = this.source.element.nativeElement;
            phElement.style.width = sourceElement.clientWidth + 'px';
            phElement.style.height = sourceElement.clientHeight + 'px';

            sourceElement.parentNode.removeChild(sourceElement);
        }

        this.targetIndex = dropIndex;
        this.target = drop;

        phElement.style.display = '';
        dropElement.parentNode.insertBefore(phElement, (dragIndex < dropIndex)
            ? dropElement.nextSibling : dropElement);

        this.source.start();
        this.placeholder.enter(drag, drag.element.nativeElement.offsetLeft, drag.element.nativeElement.offsetTop);

        return false;
    }

    __indexOf(collection, node) {
        return Array.prototype.indexOf.call(collection, node);
    }
}


