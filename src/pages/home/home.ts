// Time for the 3Ds: Declaration, Decoration and Definition

// Declaration Block
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'; // from reactiveX, for Observable Array conversion (Only works with this type!)

// Decoration Block
@Component({
  selector: 'page-home', // Changes in html will only be applied to this component
  templateUrl: 'home.html' // And here, we point to the html template we'll use
})

// Definition Block
export class HomePage {
    
    public feeds: Array<string>; // This is where the feed addresses will be stored
    private url: string = "https://www.reddit.com/new.json"; // Calling reddit feed

    constructor(public navCtrl: NavController, public http: Http) { // Instantiating the classes
        
        // Since we injected Http component here, we can use 'this' when calling it
        this.http.get(this.url).map(res => res.json())
            .subscribe(data => {
                this.feeds = data.data.children; // Sending the converted result back to the feeds Array
            });
    
  }

}
