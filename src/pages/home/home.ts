// Time for the 3Ds: Declaration, Decoration and Definition

// Declaration Block
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular'; // Adding loading, for feedback
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'; // From reactiveX, for Observable Array conversion (Only works with this type!)

// Decoration Block
@Component({
  selector: 'page-home', // Changes in html will only be applied to this component
  templateUrl: 'home.html' // And here, we point to the html template we'll use
})

// Definition Block
export class HomePage {
    
    public feeds: Array<string>; // This is where the feed addresses will be stored
    private url: string = "https://www.reddit.com/new.json"; // Calling reddit feed

    constructor(public navCtrl: NavController, public http: Http, public loadingCtrl: LoadingController) { // Instantiating the classes
        
        this.fetchContent();
        
    }
    
    // This is the function that gets called by the click event defined in the html
    itemSelected(feed):void {
        
        alert(feed.data.url); // Simple alert box fox testing purposes
        
    }
    
    // Here we fetch the content, this function is called by the constructor
    fetchContent():void {
        
        // Initializing the loading
        let loading = this.loadingCtrl.create({
            content: 'Fetching content...' // Here we define the message displayed to the user
            });
        
        // Presenting the loading message to the user
        loading.present();

        // Since we injected Http component here, we can use 'this' when calling it
        this.http.get(this.url).map(res => res.json())
            .subscribe(data => {
                this.feeds = data.data.children; // Sending the converted result back to the feeds Array
            
            // Loading is finish, so let's kill the messenger
            loading.dismiss();
                
        });
    
    }

}
