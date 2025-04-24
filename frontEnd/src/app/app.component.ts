import { Component, inject, OnInit } from '@angular/core';

import { HeaderComponent } from "./header/header.component";
// import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from "./loader/loader.component";
import { AuthService } from './services/auth.service';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private auth = inject(AuthService);
  isLoading: Boolean = false;
  title = 'academiHub';

  ngOnInit(): void {
    this.auth.isLoading$.subscribe((loading)=>{
      this.isLoading = loading;
    })
  }
}
