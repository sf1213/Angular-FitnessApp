import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import {Exercise} from '../exercise.model';
import { FormGroup, NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { map }  from 'rxjs/operators';
import { Store } from "@ngrx/store";
import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer';
//import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit{
  //@Output() trainingStart = new EventEmitter<void>();
  //exercises: Observable<Exercise[]>;
  // exercises:Exercise[];
  // exerciseSubscription: Subscription;
  exercises$:Observable<Exercise[]>;


  constructor(
    private trainingService: TrainingService, 
    private db: AngularFirestore,
    private store: Store<fromTraining.State>) { }

  ngOnInit() {
    //this.exercises = this.trainingService.getAvailableExercises();
    
    this.trainingService.fetchAvailableExercises();   
     //only subscribe to changes
    // this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
    //   exercises => (this.exercises = exercises)
    // );

    this.exercises$ = this.store.select(fromTraining.getAvailableTrainings)
     
  }

  onStartTraining(form: NgForm) {
    //this.trainingStart.emit();
    this.trainingService.startExercise(form.value.exerciseName);
  }

  fetchExercise() {
    this.trainingService.fetchAvailableExercises();   
  }

  // ngOnDestroy() {
  //   //Called once, before the instance is destroyed.
  //   this.exerciseSubscription.unsubscribe();
    
  // }
}
