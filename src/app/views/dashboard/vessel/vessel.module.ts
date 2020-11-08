import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { AppConstants } from '../../constants/app.constants';
import { SharedCustomModule } from '../../shared.module';
import {VesselDetailsComponent} from "./vessel-details.component";
import {VesselDetailsEditComponent} from "./vessel-details-edit.component";
import {NgxDropzoneModule} from "ngx-dropzone";
import {VesselGalleryComponent} from "./vessel-gallery.component";

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
    url: AppConstants.SITE_URL + 'upload/uploadImages',
    maxFilesize: 150,
    acceptedFiles: '.png, .jpg, .jpeg',
    addRemoveLinks: true,
    createImageThumbnails: true,
    withCredentials: true,
    thumbnailWidth: 150,
    thumbnailHeight: 150,

};

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Vessel',
            permission: ['vessel.view','vessel.add']
        },
        children: [
            {
                path: '',
                component: VesselDetailsComponent,
                data: {
                    title: '',
                    permission: ['vessel.view']
                }
            },
            {
                path: 'add',
                component: VesselDetailsEditComponent,
                data: {
                    title: 'Add',
                    permission: ['vessel.add']
                }
            },
            {
                path: 'edit/:id',
                component: VesselDetailsEditComponent,
                data: {
                    title: 'Edit',
                    permission: ['vessel.edit']
                }
            },
            {
                path: 'gallery/:id',
                component: VesselGalleryComponent,
                data: {
                    title: 'Edit',
                    permission: ['vessel.edit']
                }
            },

        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes), CommonModule, DropzoneModule, SharedCustomModule, NgxDropzoneModule
    ],
    providers: [
        {
            provide: DROPZONE_CONFIG,
            useValue: DEFAULT_DROPZONE_CONFIG
        }],
    declarations: [VesselDetailsComponent, VesselDetailsEditComponent, VesselGalleryComponent]
})
export class VesselModule { }
