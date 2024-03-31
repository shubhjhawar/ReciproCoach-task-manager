import { Routes } from '@angular/router';
import { MainViewComponent } from './pages/main-view/main-view.component';
import { CompletedComponent } from './pages/completed/completed.component';

export const routes: Routes = [
    { path: '', component: MainViewComponent},
    { path: 'completed', component: CompletedComponent}
];
