import { NgModule } from '@angular/core';
import { NotificationListComponent } from './notification-list/notification-list';
import { UploadedRecordsModalComponent } from './uploaded-records-modal/uploaded-records-modal';
@NgModule({
	declarations: [NotificationListComponent,
    UploadedRecordsModalComponent],
	imports: [],
	exports: [NotificationListComponent,
    UploadedRecordsModalComponent]
})
export class ComponentsModule {}
