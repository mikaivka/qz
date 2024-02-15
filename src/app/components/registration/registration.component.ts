// registration.component.ts

import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizApiService } from '../../services/quiz-api.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  loginForm!: FormGroup;
  errorMessage!: string;
  cisubmitted = false;
  loginSubmit = false;
  loading: boolean = true;
  @ViewChild('hiddenButton')
  hiddenButton!: ElementRef;
  constructor(
    private fb: FormBuilder,
    private quizApiService: QuizApiService,
    private router: Router,
    private location: Location
  ) {
    this.GetZone();
  }

  ngOnInit(): void {
    this.location.subscribe(() => {
      // Prevent the back button action
      this.location.forward();
    });

    setTimeout(() => {
      this.loading = false;
    }, 3000);
    this.registrationForm = this.RegistrationValidationForm();
  }


  /*Registration*/

  get ci() {
    return this.registrationForm.controls;
  }

  RegistrationValidationForm() {
    return this.fb.group({
      nm: ['', Validators.required],
      // em: ['', Validators.required, Validators.email],
      mn: [''],
      zn: ['', Validators.required],
      ct: ['', Validators.required],
      ty: ['1'],
    });
  }
  alreadyExists: boolean = false;
  handleRegistration(): void {
    debugger;
    localStorage.clear();
    //  this.router.navigate(['/otp']);
    //  return;
    this.cisubmitted = true;
    if (this.registrationForm.invalid) {
      return;
    }
    this.loading = true;
    const registrationData = this.registrationForm.value;

    this.quizApiService.register(registrationData).subscribe(
      (response: {
        rs: number;
        res: {
          tkn: any;
          id: string;
        };
      }) => {
        localStorage.setItem('pw:usr', JSON.stringify(response));
        localStorage.setItem('pw:usr:id', JSON.stringify(response.res.id));
        localStorage.setItem('pw:usr:tkn', JSON.stringify(response.res.tkn));
        this.hiddenButton.nativeElement.click();
        
      },
      (error: any) => {
        console.error('Registration failed:', error);
        this.errorMessage = 'Registration failed. Please try again.';
        // Handle error, e.g., display error message to the user
      }
    );
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  ZoneList: any[] = [];
  GetZone() {
    debugger;
    const params = new HttpParams();
    // .set('userId', userId)
    // .set('answerData', answerData);
    this.quizApiService.GetZone(params).subscribe(
      (response: { rc: any[]; rs: number }) => {
        this.ZoneList = response.rc;
      },
      (error: any) => {
        console.error('Registration failed:', error);
      }
    );
  }
  CityList: any[] = [];

  onZoneChange(): void {
    const selectedZoneId = this.ZoneList.find(x=>x.text==this.registrationForm.value.zn);
    //const selectedZoneId = this.registrationForm.value.zn;
    const params = new HttpParams().set('id', selectedZoneId.value);
    // .set('answerData', answerData);
    this.quizApiService.GetCity(params).subscribe(
      (response: { rc: any[]; rs: number }) => {
        this.CityList = response.rc;
      },
      (error: any) => {
        console.error('Registration failed:', error);
      }
    ); // Reset the selected city when the zone changes
  }

  continueWithRules(): void {
    this.router.navigate(['/verifing']);
  }
}
