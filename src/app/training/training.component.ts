import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import { TrainingService } from './training.service';
import { Store } from "@ngrx/store";
import * as fromTraining from './training.reducer';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit{
  //ongoingTraining = false;
  //exerciseSubscription: Subscription;
  ongoingTraining$ : Observable<boolean>;
  
  constructor(private trainingService: TrainingService, private store: Store<fromTraining.State>) { }

  ngOnInit() {
    // this.exerciseSubscription = this.trainingService.exerciseChanged.subscribe(
    //   exercise => {
    //   if (exercise) {
    //     this.ongoingTraining = true;
    //   } else {
    //     this.ongoingTraining = false;
    //   }
      
    // })

    this.ongoingTraining$ = this.store.select(fromTraining.getIsTrainings);

  }

  // ngOnDestroy() {
  //   //Called once, before the instance is destroyed.
  //   this.exerciseSubscription.unsubscribe();
    
  // }

}
