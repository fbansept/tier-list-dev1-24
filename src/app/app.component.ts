import { Component } from '@angular/core';
import { ListeComponent } from "./liste/liste.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [ListeComponent]
})
export class AppComponent {

}
