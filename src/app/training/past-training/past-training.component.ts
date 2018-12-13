import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import {Exercise} from '../exercise.model';
import { TrainingService } from '../training.service';
import { Subscription } from 'rxjs';
import { Store } from "@ngrx/store";
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit{
  displayedColumns = ['data', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  //private exChangedSubscription: Subscription;

  constructor(private trainingService: TrainingService,
    private store: Store<fromTraining.State>) { }
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.trainingService.fetchCompleteOrCancelledExercise();

    // this.exChangedSubscription = this.trainingService.finishedExercisesChanged.subscribe(
    //   exercises => (this.dataSource.data = exercises)
    // );
    this.store.select(fromTraining.getFinishedTrainings).subscribe(
      exercises => {
      this.dataSource.data = exercises;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // ngOnDestroy() {
  //   //Called once, before the instance is destroyed.
  //   this.exChangedSubscription.unsubscribe();
    
  // }

}
