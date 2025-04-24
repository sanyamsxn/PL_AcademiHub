import { Component, DestroyRef, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ FormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  success: boolean = false;
  error : boolean = false;

  private toastr = inject(ToastrService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  onSubmit(formI : NgForm) {
    const formData = formI.value;
    if(formI.valid){
      this.auth.showLoader();
      const subscription = this.httpClient.post('http://localhost:5000/auth/signup', formData)
        .subscribe({
          next:(res:any)=>{
            console.log(res);
            if(res.success){
              this.success = true;
              setTimeout(() => {
                this.auth.hideLoader();
                this.router.navigate(['/signin']);
              }, 2000);
            }
            else{
              this.auth.hideLoader();
              this.toastr.error(res.message);
              formI.reset();
            }
          },
          error:(err)=>{
            this.auth.hideLoader();
            this.error = true;
            this.toastr.error(err.error.message);
            formI.reset();
          }
        })
    }
    else{
      this.toastr.error("Invalid form");
    }
    
  }
}
