// quiz.component.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { QuizApiService } from '../../services/quiz-api.service';
import { Location } from '@angular/common';
interface Question {
  id: any;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit {
  questions: any[] = [
  ];
  data: any[] = [];
  currentQuestionIndex: number = 0;
  currentQuestion: any = null;
  selectedOption: string | null = null;
  tim = localStorage.getItem('pw:timer');
  timerDuration: number = 4 * 60; // Default timer duration in seconds (15 minutes)
  timer: number = 2400;//240; // 4 minutes in seconds
  timerInterval: any;
  initialPage: boolean = true;

  singleAnswerTimer: number = 0;
  displayedData: any[] = [];
  loading: boolean = true;
  showFSeconds: boolean = true;
  fiveSecTimer = 5;
  accessToken:any;
  constructor(
    private http: HttpClient,
    private quizApiService: QuizApiService,
    private location: Location
  ) {
    let scr = localStorage.getItem('usr:score');
    if(this.totalScore==0){
      this.totalScore = scr==null ? this.totalScore : scr;
    }
    this.currentQuestion = null;
    this.timer = this.tim == null || this.tim == '' ? 240 : parseInt(this.tim); // 4 minutes in seconds
this.getQuestions();
  }
  getRandomRecords(count: number): void {
    const randomIndexes: number[] = [];
    while (randomIndexes.length < count) {
      const randomIndex = Math.floor(Math.random() * this.data.length);
      if (!randomIndexes.includes(randomIndex)) {
        randomIndexes.push(randomIndex);
      }
    }
    const __list = randomIndexes.map((index) => this.data[index]);
    debugger;
    this.questions = __list;
  }

  getQuestions() {
    debugger;
    const tkn = localStorage.getItem('pw:usr:tkn');
    const accessToken = tkn ? JSON.parse(tkn) : null;
    const params = new HttpParams().set('currentPage', 1).set('recordsPerPage', 10);
    this.quizApiService.GetQuestions(params,accessToken).subscribe(
      (response: { rc: any[]; rs: number }) => {
        this.loading=false;
        this.questions = response.rc;
        this.loadQuestion();
      },
      (error: any) => {
        //console.error('Registration failed:', error);
      }
    );
  }

  ngOnInit(): void {
    
    //this.accessToken = localStorage.getItem('pw:usr:tkn');
    const tkn = localStorage.getItem('pw:usr:tkn');
    this.accessToken = tkn ? JSON.parse(tkn) : null;
    this.location.subscribe(() => {
      // Prevent the back button action
      this.location.forward();
    });
    if (localStorage.getItem('pw:expire') == 'yes') {
      //this.router.navigate(['/quiz']);
      this.currentQuestion = null!;
      this.timer = 0;
    }
    else {
      //this.getQuestions();
      // // const jsonFile = 'assets/questionv1.json';
      // // debugger;
      // // // Fetch the JSON file using HttpClient
      // // this.http.get<any[]>(jsonFile).subscribe((data: any[]) => {
      // //   this.data = data; // Assign retrieved data to questions array
        //this.getRandomRecords(10);
        this.loadQuestion();
        this.startTimer();
        // this.startCountdown();
      //});


    }
    
  }

  // getQuestions(){

  // }


  showCountdown: boolean = true;
  countdown: number = 5;
 

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
        localStorage.setItem('pw:timer', this.timer.toString());
        this.singleAnswerTimer++;
      } else {
        clearInterval(this.timerInterval);
        localStorage.setItem('pw:expire', 'yes');
        localStorage.setItem('pw:timer', '0');
        // this.timer = 0;
        // Time's up, handle it accordingly
        console.log("Time's up!");
        if (localStorage.getItem('pw:submit') == 'yes') {

        } else {
          this.sendAnswers();
        }


        // this.currentQuestion = null!;
      }
    }, 1000);
  }



  loadQuestion(): void {
    this.currentQuestion = this.questions[this.currentQuestionIndex];
  }

  selectOption(option: string, i: any,item:any): void {
    const ansId = item.id;
    const selectedId = this.currentQuestion.id;
    localStorage.setItem('qi' + selectedId, i)
    this.selectedOption = option;
    // const isCorrect =
    //   option ===
    //   this.currentQuestion.options[this.currentQuestion.correctOptionIndex];

    const isCorrect =item.isCorrectAns;

    let IsPushFlag = false;
    let ansTime = this.singleAnswerTimer;
    this.singleAnswerTimer = 0;
    if (this.answeredOptions.length > 0) {
      this.answeredOptions.forEach((element: any) => {
        if (element.qId == this.currentQuestion.id) {
          IsPushFlag = true;
          element.timeGiven = element.timeGiven + ansTime;
          element.qId = selectedId,
            element.ansId = ansId,
            element.isCorrect = isCorrect
        }

      });
    }

    const data = {
      qId: selectedId,
      ansId: ansId,
      isCorrect: isCorrect,
      timeGiven: ansTime,
    };
    if (!IsPushFlag) {
      this.answeredOptions.push(data);
    }


  }

  answeredOptions: any = [];

  nextQuestion(): void {
    debugger;
    if (this.currentQuestionIndex >= this.questions.length) {
      this.currentQuestion = null!;
      console.log(1);
      this.sendAnswers();
      return;
    }
    this.singleAnswerTimer = 0;
    // this.loading = false;
    //clearInterval(this.timerInterval);
    if(this.currentQuestionIndex>= this.questions.length){}else{this.currentQuestionIndex++;}
   // this.currentQuestionIndex++;
    if (this.currentQuestionIndex < this.questions.length) {
      this.loadQuestion();
    } else {
      this.currentQuestion = null!;
      console.log(2);
      this.sendAnswers();
    }


    if (this.answeredOptions.length > 0 && this.currentQuestion!=null) {
      this.answeredOptions.forEach((element: any) => {
        if (element.qId == this.currentQuestion.id) {
          const selectedIndex = localStorage.getItem('qi' + this.currentQuestion.id);
          const ind = selectedIndex ? JSON.parse(selectedIndex) : null;
          this.selectedOption = this.currentQuestion.anslist[parseInt(ind)].answerText_En;
        }
      });
    }
  }

  previousQuestion() {
    debugger;
    this.currentQuestionIndex--;
    if (this.currentQuestionIndex < this.questions.length) {
      this.loadQuestion();

    } else {
      this.currentQuestion = null!;
      //this.sendAnswers();

    }

    if (this.answeredOptions.length > 0 && this.currentQuestion!=null) {
      this.answeredOptions.forEach((element: any) => {
        if (element.qId == this.currentQuestion.id) {
          const selectedIndex = localStorage.getItem('qi' + this.currentQuestion.id);
          const ind = selectedIndex ? JSON.parse(selectedIndex) : null;
          this.selectedOption = this.currentQuestion.anslist[parseInt(ind)].answerText_En;
        }
      });
    }

  }

  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
  totalScore: any = 0;
  correctCount: any = 0;
  sendAnswers(): void {
    this.loading = true;
    const globalConsumedTime = 240 > this.timer ? 240 - this.timer : 240;
    let correctCount = 0;
    this.answeredOptions.forEach((element: any) => {
      element.timeGiven = globalConsumedTime;
      if (element.isCorrect) {
        correctCount++;
      }
    });
    
    this.totalScore = correctCount * 10;
    

    localStorage.setItem('usr:score',this.totalScore);

    const payload = {
      jsonbulk: this.answeredOptions,

    };

    this.quizApiService.PostUserAnswerBulk(payload,this.accessToken).subscribe(
      (response: { rs: number; }) => {
        setTimeout(() => {
          this.loading = false;
        }, 2000);
        if (response.rs == 1) {
          //localStorage.clear();
          this.timer = 0;
          localStorage.setItem('pw:usr', JSON.stringify(response));
          localStorage.setItem('pw:expire', 'yes');
          localStorage.setItem('pw:timer', '0');
          localStorage.setItem('pw:submit', 'yes');
        }else{
          this.timer = 0;
          localStorage.setItem('pw:expire', 'yes');
          localStorage.setItem('pw:timer', '0');
          localStorage.setItem('pw:submit', 'yes');
        }
      },
      (error: any) => {
        this.currentQuestion = null!;
        this.timer = 0;
        console.error('Registration failed:', error);
      }
    );
    setTimeout(() => {
     // localStorage.clear();
      this.loading = false;
    }, 2000);
  }

}
