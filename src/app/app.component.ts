import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'EmpCRUD';
  displayedColumns: string[] = ['personName', 'personPosition', 'personDoB', 'personDepartment', 'personSalary', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog : MatDialog, private api : ApiService) {

  }
  ngOnInit(): void {
    this.getAllPersons();
  }
  openDialog() {
    this.dialog.open(DialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val ==='save'){
        this.getAllPersons();
      }
    })
  }
  getAllPersons() {
    this.api.getPerson()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        alert("Whoops, we have an error")
      }
    })
  }

  editPerson(row : any){
    this.dialog.open(DialogComponent, {
      width: '30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getAllPersons();
      }
    })
  }

  deletePerson(id:number){
    this.api.deletePerson(id)
    .subscribe({
      next:(res)=>{
        alert("Deleted")
        this.getAllPersons();
      },
      error:()=>{
        alert("Error while deleting")
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
