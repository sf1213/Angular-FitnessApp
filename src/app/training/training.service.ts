import {Exercise} from './exercise.model';
import {Subject} from "rxjs/Subject";
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map }  from 'rxjs/operators';
import {Subscription} from "rxjs";
import { UIService } from "../shared/ui.service";
import { take } from 'rxjs/operators'
import { Store } from "@ngrx/store";
import * as fromTraining from './training.reducer';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';


@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise>(); //runningExercise change, then emit event
    exercisesChanged = new Subject<Exercise[]>(); //availableExercise from database change, then emit event
    finishedExercisesChanged = new Subject<Exercise[]>(); //finishedExercises change, then emit this event
    private runningExercise: Exercise;
    private availableExercise: Exercise[] = [];
    private fbSub: Subscription[] = [];
    //private finishedExercises: Exercise[] = [];

    // private availableExercise: Exercise[] = [
    //     { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    //     { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    //     { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    //     { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
    // ]
    

    constructor(private db: AngularFirestore, 
        private uiService: UIService, 
        private store: Store<fromTraining.State>) {}

    //fetch exercises from firebase and set up the subscription
    fetchAvailableExercises() {
        //return this.availableExercise.slice();
        this.fbSub.push(this.db
        .collection('availableExercise')
        .snapshotChanges()  //all the megdata including id
        .pipe(map(docArray => {
            return docArray.map(doc => {
            return {
                id: doc.payload.doc.id,
                ...doc.payload.doc.data()
            } as Exercise;
            });
        }))
        .subscribe((exercise: Exercise[]) => {
            console.log(exercise);
            //this.availableExercise = exercise;
            //this.exercisesChanged.next([...this.availableExercise]); //trigger this when exercises from database update
            this.store.dispatch(new UI.StopLoading());
            this.store.dispatch(new Training.SetAvailableTrainings(exercise));
        }, err => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar("Fech exercises failed, please try later", null, 3000);
            this.exerciseChanged.next(null);
        }));
    }


    fetchCompleteOrCancelledExercise() {
        //return this.exercises.slice(); //slice: get a new copy    
        this.fbSub.push(this.db
        .collection("finishedExercises")
        .valueChanges()   //no id
        .subscribe((exercises: Exercise[]) => {
            //this.finishedExercisesChanged.next(exercises); //pass the exersices from server to whomever is interested
            this.store.dispatch(new Training.SetFinishedTrainings(exercises));
        }))
    }


    cancelSubscriptions() {
        this.fbSub.forEach(sub => sub.unsubscribe());
        
    }

    // getRuningExercise() {
    //     return {...this.runningExercise};
    // }

    startExercise(selectedId: string) {
        // this.runningExercise = this.availableExercise.find(ex => ex.id == selectedId);
        // this.exerciseChanged.next({...this.runningExercise});
        this.store.dispatch(new Training.StartTraining(selectedId));
    }


    cancelExercise(progress: number) {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(exercise => {
            this.addDataToDatabase({
                ...exercise,
                duration:exercise.duration * (progress / 100),
                calories:exercise.duration * (progress / 100),
                date: new Date(),
                state: "cancelled"
                });
            // this.runningExercise = null;
            // this.exerciseChanged.next(null);
            this.store.dispatch(new Training.StopTraining());
        });
    }


    completeExercise() {
        this.store.select(fromTraining.getActiveTraining).subscribe(exercise => {
            this.addDataToDatabase({
                ...exercise,
                date: new Date(),
                state: "completed"
                });
            // this.runningExercise = null;
            // this.exerciseChanged.next(null);
            this.store.dispatch(new Training.StopTraining());
        })
        
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection("finishedExercises").add(exercise)
    }

}