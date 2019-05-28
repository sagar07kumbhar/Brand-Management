import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule} from '@angular/cdk/overlay';

import { AppComponent } from './app.component';

import { SuperadminComponent } from './superadmin/superadmin.component';
import { AdminComponent } from './admin/admin.component';
import { TeacherComponent } from './teacher/teacher.component';
import { StudentComponent } from './student/student.component';
import { ParentComponent } from './parent/parent.component';
import { LoginComponent } from './login/login.component';
import { SharedComponent } from './shared/shared.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { AppHeaderComponent } from './layout/header.component';
import { AppFooterComponent } from './layout/footer.component';
import { DashboardComponent } from './superadmin/dashboard/dashboard.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
import { ParentDashboardComponent } from './parent/parent-dashboard/parent-dashboard.component';
import { RegisterComponent } from './register/register.component';
import { AddUserComponent } from './shared/add-user/add-user.component';
import { ViewUserComponent } from './shared/view-user/view-user.component';
import { ProfileComponent } from './shared/profile/profile.component';

/**********Material modules ****************/

import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// import { NativeDateAdapter } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatTreeModule } from '@angular/material/tree';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRippleModule } from '@angular/material/core';

/************************ends ************************/

import { MTservice } from './mt-services';
import { MTvalidators } from './mt-validators';

/***guards***/

import { SuperadminGuard } from './guards/superadmin.guard';
import { AdminGuard } from './guards/admin.guard';
import { TeacherGuard } from './guards/teacher.guard';
import { StudentGuard } from './guards/student.guard';
import { ParentGuard } from './guards/parent.guard';
import { NotLogged } from './guards/mt-dact';


const appRoutes: Routes = [
  {path: '', redirectTo:'login', pathMatch: 'full'},
  {path: '404', component: NotFoundComponent},
  {
    path: 'login', 
    component: LoginComponent,
    canActivate: [NotLogged]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NotLogged],
    children: [
      {path: '', component: RegisterComponent},
    ]
  },
  {
    path: 'superadmin',
    component: SuperadminComponent,
    canActivate: [SuperadminGuard],
    children: [
      {path: '', component: DashboardComponent},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'adduser', component: AddUserComponent},
      {path: 'viewuser', component: ViewUserComponent},
      {path: 'profile', component: ProfileComponent},
    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {path: '', component: AdminDashboardComponent},
      {path: 'dashboard', component: AdminDashboardComponent},
      {path: 'profile', component: ProfileComponent},
    ]
  },
  {
    path: 'student',
    component: StudentComponent,
    canActivate: [StudentGuard],
    children: [
      {path: '', component: StudentDashboardComponent},
      {path: 'dashboard', component: StudentDashboardComponent},
      {path: 'profile', component: ProfileComponent},
    ]
  },
  {
    path: 'teacher',
    component: TeacherComponent,
    canActivate: [TeacherGuard],
    children: [
      {path: '', component: TeacherDashboardComponent},
      {path: 'dashboard', component: TeacherDashboardComponent},
      {path: 'profile', component: ProfileComponent},
    ]
  },
  {
    path: 'parent',
    component: ParentComponent,
    canActivate: [ParentGuard],
    children: [
      {path: '', component: ParentDashboardComponent},
      {path: 'dashboard', component: ParentDashboardComponent},
      {path: 'profile', component: ProfileComponent},
    ]
  },
  {path: '**', redirectTo: '404', pathMatch: 'full'},

];


@NgModule({
  declarations: [
    AppComponent,
    SuperadminComponent,
    AdminComponent,
    TeacherComponent,
    StudentComponent,
    ParentComponent,
    LoginComponent,
    SharedComponent,
    NotFoundComponent,
    AppHeaderComponent,
    AppFooterComponent,
    DashboardComponent,
    AdminDashboardComponent,
    StudentDashboardComponent,
    TeacherDashboardComponent,
    ParentDashboardComponent,
    RegisterComponent,
    AddUserComponent,
    ViewUserComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false
      }
    ),
    HttpModule,
    FormsModule,
    OverlayModule,
    MatCardModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDividerModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatInputModule,
    MatGridListModule,
    MatSelectModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatRadioModule,
    MatBadgeModule,
    OverlayModule,
    MatMenuModule,
    MatExpansionModule,
    MatTabsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatTreeModule,
    MatChipsModule,
    MatStepperModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatRippleModule
  ],
  providers: [
    MTservice,
    MTvalidators,
    SuperadminGuard,
    AdminGuard,
    TeacherGuard,
    StudentGuard,
    ParentGuard,
    NotLogged
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
