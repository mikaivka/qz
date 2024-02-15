// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './components/quiz/quiz.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { OtpComponent } from './components/otp/otp.component';
const routes: Routes = [
  { path: '', redirectTo: '/registration', pathMatch: 'full' }, // Redirect to the quiz page by default
  // {
  //   path: 'account',
  //   loadChildren: () => import('./module/account/account.module').then(m => m.AccountModule)
  // },
  
  { path: 'quiz', component: QuizComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'verifing', component: OtpComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
