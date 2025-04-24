import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { BranchCubesComponent } from '../branch-cubes/branch-cubes.component';
import { AuthService } from '../services/auth.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [HeaderComponent, BranchCubesComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  loggedIn: Boolean =false;
  constructor(){
    const token =this.auth.getToken();
    console.log(token);
    if(token!=null){
      console.log("Enter");
      this.loggedIn = true;
    }
    else{
      this.loggedIn =false;
    }
  }


  onClick(){
    this.router.navigate(['/dashboard']);
  }
}
