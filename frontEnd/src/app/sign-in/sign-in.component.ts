import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

private http = inject(HttpClient);
private authService = inject(AuthService);
private router = inject(Router);
private toastr = inject(ToastrService);


onSubmit(form: NgForm){
  const formData=  form.value;
  if(form.valid){
    this.authService.showLoader();
    const subscription = this.http.post('http://localhost:5000/auth/signin', formData).subscribe({
      next:(res:any)=>{
        if(res.success){
          this.authService.setToken(res.token);
          this.authService.setUser(res.user);
          setTimeout(() => {
            this.authService.hideLoader();
            this.router.navigate(['/dashboard']);
          }, 4000);
        }else{
            this.authService.hideLoader();
            this.toastr.error(res.message);
            form.reset();
        }

      },
      error : (err)=>{
        this.authService.hideLoader();
        this.toastr.error(err.error.message);
        form.reset();
      }
    })
  }
  else{
    this.toastr.error("Invalid Credentials")
  }
}

}
