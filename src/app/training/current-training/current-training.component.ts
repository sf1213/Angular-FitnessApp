import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { take } from 'rxjs/operators'
import { Store } from "@ngrx/store";
import * as fromTraining from '../training.reducer';
import { StopTrainingComponent} from './stop-training.component'
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  progress = 0;
  timer : number;
  //@Output() trainingExit = new EventEmitter();


  constructor(private dialog: MatDialog, 
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>) { }

  ngOnInit() {
    this.startOrResumeTimer();
  }

  startOrResumeTimer() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(exercise => {
      const step = exercise.duration / 100 * 1000;
      this.timer = setInterval(() => {
        this.progress = this.progress + 1;
  
        if (this.progress >= 100) {
          this.trainingService.completeExercise();
          clearInterval(this.timer);
        }
      }, step)
    });
    
  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress : this.progress
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      //result is boolean, true: stop
      if (result) {
        //this.trainingExit.emit();
        console.log(result);  
        this.trainingService.cancelExercise(this.progress);
      } else {
        this.startOrResumeTimer();
      }
    })
  }

  
}
