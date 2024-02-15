// otp.component.ts

import { Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
})
export class OtpComponent {
  constructor(private router: Router,private location: Location) {}

  ngOnInit(): void {
    // const interval = setInterval(() => this.showTimer(), 1000);
    this.location.subscribe(() => {
      // Prevent the back button action
      this.location.forward();
      //this.location.back();
    });
    this.showTimer();
  }
  time = 5;

  showTimer() {
    const timerInterval = setInterval(() => {
      let timer = document.getElementById('timer')!;
      //  let time =5;// document.getElementById("time")?.innerText!;
      if (this.time > 1) {
        timer.classList.add('scale-0');
        timer.classList.remove('scale-0');
        timer.classList.add('scale-100');
        this.time--;
      } else {
        //alert('time ends');
        clearInterval(timerInterval);
        this.router.navigate(['/quiz']);
      }
    }, 1000);
  }

}
