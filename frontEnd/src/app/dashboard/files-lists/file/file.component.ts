import { Component, inject, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-file',
  standalone: true,
  imports: [],
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent {
  @Input() fileData:any;
  private toastr = inject(ToastrService);


  onDownload(filename:any){
    const url = `http://localhost:5000/auth/download?filename=${filename}`;

    window.open(url, '_blank');
    this.toastr.success("Downloaded");
  }
}
