var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { OrderModule } from 'ngx-order-pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MyApp } from './app.component';
import { StartupPage } from '../pages/startup/startup';
import { PatientHomePage } from '../pages/patient-home/patient-home';
import { PatientLoginPage } from '../pages/patient-login/patient-login';
import { PatientRegisterPage } from '../pages/patient-register/patient-register';
import { PatientSetupPage } from '../pages/patient-setup/patient-setup';
import { PatientTabsPage } from '../pages/patient-tabs/patient-tabs';
import { PatientProfileTabPage } from '../pages/patient-profile-tab/patient-profile-tab';
import { PatientRecordTabPage } from '../pages/patient-record-tab/patient-record-tab';
import { PatientAppointmentsTabPage } from '../pages/patient-appointments-tab/patient-appointments-tab';
import { PatientDiseasePredictorTabPage } from '../pages/patient-disease-predictor-tab/patient-disease-predictor-tab';
import { PatientPrescriptionsTabPage } from '../pages/patient-prescriptions-tab/patient-prescriptions-tab';
import { DoctorHomePage } from '../pages/doctor-home/doctor-home';
import { DoctorRegisterPage } from '../pages/doctor-register/doctor-register';
import { DoctorMenuPage } from '../pages/doctor-menu/doctor-menu';
import { NotificationListComponent } from '../components/notification-list/notification-list';
import { UploadedRecordsModalComponent } from '../components/uploaded-records-modal/uploaded-records-modal';
import { RestProvider } from '../providers/rest/rest';
import { UtilityProvider } from '../providers/utility/utility';
import { NotificationsProvider } from '../providers/notifications/notifications';
// Initialize Firebase
var firebaseAuth = {
    apiKey: "AIzaSyB6ug6kqiEJFtr2dBqleKXZKRllPHQEG_A",
    authDomain: "ehrs-32d7f.firebaseapp.com",
    databaseURL: "https://ehrs-32d7f.firebaseio.com",
    projectId: "ehrs-32d7f",
    storageBucket: "ehrs-32d7f.appspot.com",
    messagingSenderId: "1015812043978"
};
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                MyApp,
                StartupPage,
                PatientHomePage,
                PatientLoginPage,
                PatientRegisterPage,
                PatientSetupPage,
                PatientTabsPage,
                PatientProfileTabPage,
                PatientRecordTabPage,
                PatientDiseasePredictorTabPage,
                PatientAppointmentsTabPage,
                PatientPrescriptionsTabPage,
                DoctorHomePage,
                DoctorRegisterPage,
                DoctorMenuPage,
                NotificationListComponent,
                UploadedRecordsModalComponent
            ],
            imports: [
                BrowserModule,
                FormsModule,
                IonicModule.forRoot(MyApp, {}, {
                    links: [
                        { component: DoctorHomePage, name: 'doctor-home-page', segment: 'doctor' }
                    ],
                }),
                AngularFireModule.initializeApp(firebaseAuth),
                AngularFireDatabaseModule,
                AngularFireAuthModule,
                AngularFirestoreModule,
                IonicStorageModule.forRoot(),
                HttpClientModule,
                OrderModule,
                Ng2SearchPipeModule
            ],
            bootstrap: [IonicApp],
            entryComponents: [
                MyApp,
                StartupPage,
                PatientLoginPage,
                PatientHomePage,
                PatientRegisterPage,
                PatientSetupPage,
                PatientTabsPage,
                PatientProfileTabPage,
                PatientRecordTabPage,
                PatientDiseasePredictorTabPage,
                PatientAppointmentsTabPage,
                PatientPrescriptionsTabPage,
                DoctorHomePage,
                DoctorRegisterPage,
                DoctorMenuPage,
                NotificationListComponent,
                UploadedRecordsModalComponent
            ],
            providers: [
                StatusBar,
                SplashScreen,
                AngularFireDatabase,
                { provide: ErrorHandler, useClass: IonicErrorHandler },
                RestProvider,
                UtilityProvider,
                NotificationsProvider,
                InAppBrowser
            ]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map