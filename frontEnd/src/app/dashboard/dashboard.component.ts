import { Component, inject, OnInit } from '@angular/core';
import { FilesListsComponent } from './files-lists/files-lists.component';
import { FiltersComponent } from './filters/filters.component';
import { HeaderComponent } from '../header/header.component';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UploadComponent } from '../upload/upload.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FilesListsComponent, FiltersComponent, MatDialogModule, ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})


export class DashboardComponent {

  constructor(private dialog: MatDialog) {
  }

openUploadDialog(): void {
  const mainContent = document.getElementById('mainD');

    // Add blur effect
    if (mainContent) {
      mainContent.classList.add('blurred-background');
    }
  const dialogRef=this.dialog.open(UploadComponent, {
    width: '700px', // Customize as needed
    disableClose: true, // Optional: user can’t click outside to close
    panelClass: 'custom-dialog-container',
  });
  dialogRef.afterClosed().subscribe(() => {
    if (mainContent) {
      // Remove the blur effect
      mainContent.classList.remove('blurred-background');
    }
  });
}
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private auth = inject(AuthService);

  selectedFilter:string = '';
  files: any[] = [];

  ngOnInit(): void {
    this.loadMostDownloaded();

    this.auth.fileUpdated$.subscribe(()=>{
      this.loadMostDownloaded();
    })
  }

  //load most downloaded files
  loadMostDownloaded(): void {
    this.http.get<any[]>('http://localhost:5000/auth/most-downloaded').subscribe({
      next: (res:any) => {
        if(res.success){
          this.files = res.data;    
        } else {
          this.toastr.error("Failed to load files");
        }
      },
      error: (err) => {
        console.error('Failed to load most downloaded files:', err);
      }
    });
  }

  //load files based on the provided filter as a id
  loadFilesFilter(){
    this.http.get<any[]>(`http://localhost:5000/auth/files?filter=${this.selectedFilter}`).subscribe({
      next:(res:any)=>{
        if(res.success){
          this.files = res.files;
        }
        else{
          this.toastr.error("Failed to load files");
        }
      },
      error: (err)=>{
        this.toastr.error("Failed");
      }
    })
  }
  

  //load files based on the selected filters.
  onSelectFilter(filter :string){
    this.selectedFilter = filter;
    this.loadFilesFilter();
  }
  
}
