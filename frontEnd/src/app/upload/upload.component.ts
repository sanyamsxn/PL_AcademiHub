import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [FormsModule, CommonModule, MatDialogModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  selectedFile: File | null = null;
  fileName:String ='';

  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private auth = inject(AuthService);

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && this.isValidFileType(file)) {
      this.selectedFile = file;
      this.fileName = this.selectedFile.name;
    } else {
      alert('Only PDF and PPT files are allowed.');
      input.value = ''; // Reset input
      this.selectedFile = null;
    }
  }

  isValidFileType(file: File): boolean {
    const allowedTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    return allowedTypes.includes(file.type);
  }


  //upload file
  onSubmit(form: any): void {
    if (form.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('subject', form.value.stream);  // assuming 'stream' is your subject
      formData.append('year', form.value.year);
      formData.append('file', this.selectedFile);

      const user = this.auth.getUser();
      formData.append('uploadedBy', user.name);

      this.http.post('http://localhost:5000/auth/upload', formData)
      .subscribe({
        next:(res:any)=>{
          if(res.success){
            this.dialogRef.close();
            this.auth.triggerFileUpdate();
            this.router.navigate(['/dashboard']);
          }
          else{
            this.toastr.error("Error");
            
          }
        },
        error:(err)=>{

          this.toastr.error(err.error.message);
          
        }
      })
    }

    else{
      alert("Please fill all the fields!!!");
    }
  }


  constructor(public dialogRef: MatDialogRef<UploadComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
