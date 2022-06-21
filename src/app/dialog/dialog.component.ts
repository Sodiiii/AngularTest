import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  personForm!: FormGroup;
  actionBtn : string = "Save"
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    this.personForm = this.formBuilder.group({
      personName: ['', Validators.required],
      personPosition: [''],
      personDoB: [''],
      personDepartment: [''],
      personSalary: [''],
    });

    if(this.editData){
      this.actionBtn = "Update";
      this.personForm.controls['personName'].setValue(this.editData.personName);
      this.personForm.controls['personPosition'].setValue(this.editData.personPosition);
      this.personForm.controls['personDoB'].setValue(this.editData.personDoB);
      this.personForm.controls['personDepartment'].setValue(this.editData.personDepartment);
      this.personForm.controls['personSalary'].setValue(this.editData.personSalary);
    }
  }
  addPerson() {
    if(!this.editData){
      if (this.personForm.valid) {
        this.api.postPerson(this.personForm.value).subscribe({
          next: (res) => {
            alert('Person added');
            this.personForm.reset();
            this.dialogRef.close('save');
          },
          error: () => {
            alert('Whoops, we have some troubles now');
          },
        });
      }
    }else{
      this.updatePerson()
    }
  }
  updatePerson(){
    this.api.putPerson(this.personForm.value, this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("Person info updated")
        this.personForm.reset();
        this.dialogRef.close('update')
      },
      error:()=>{
        alert("Something wrong while updating")
      }
    })
  }
}
