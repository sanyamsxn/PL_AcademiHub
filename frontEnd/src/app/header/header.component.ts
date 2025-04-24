import { Component, inject, OnInit} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  user:any;

  ngOnInit(): void {
    this.authService.user$.subscribe(
      user=> {this.user =user;}
    )
  }
  getUserName(name:String){
    return name.split(' ')[0].toUpperCase();
  }
  logOut(){
    this.authService.showLoader();
    this.authService.logout();
    this.user = null;
    setTimeout(()=>{
      this.authService.hideLoader();
    this.router.navigate(['/signin']);
    }, 2000)
  }


}
