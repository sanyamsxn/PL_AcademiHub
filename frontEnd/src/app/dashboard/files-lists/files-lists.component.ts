import { Component, Input } from '@angular/core';
import { FileComponent } from './file/file.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-files-lists',
  standalone: true,
  imports: [FileComponent, CommonModule],
  templateUrl: './files-lists.component.html',
  styleUrl: './files-lists.component.css'
})
export class FilesListsComponent {
  @Input() files:any[]=[];

}
