// Time for the 3Ds: Declaration, Decoration and Definition

// Declaration Block
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular'; // Adding loading, for feedback
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'; // From reactiveX, for Observable Array conversion (Only works with this type!)
import { InAppBrowser } from 'ionic-native';

// Decoration Block
@Component({
  selector: 'page-home', // Changes in html will only be applied to this component
  templateUrl: 'home.html' // And here, we point to the html template we'll use
})

// Definition Block
export class HomePage {
    
    public feeds: Array<any>; // This is where the feed addresses will be stored
    private url: string = "https://www.reddit.com/new.json"; // Calling reddit feed
    private olderPosts: string = "https://www.reddit.com/new.json?after=";

    constructor(public navCtrl: NavController, public http: Http, public loadingCtrl: LoadingController) { // Instantiating the classes
        
        this.fetchContent();
        
    }
    
    // This is the function that gets called by the click event defined in the html
    itemSelected(url: string):void {
        
        let browser = new InAppBrowser(url, '_system'); // Openning the link in the InAppBrowser
        
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
                
                // Dealing with broken thumbnails
                this.feeds.forEach(( e, i, a ) => {

                    if (!e.data.thumbnail || e.data.thumbnail.indexOf('b.thumbs.redditmedia.com') === -1 ) {
                        
                        // Setting the default thumbnail
                        e.data.thumbnail = 'http://www.redditstatic.com/icon.png';
                        
                    }

                })
            
            // Loading is finish, so let's kill the messenger
            loading.dismiss();
                
        });
    
    }
    
    // Here we fetch the contents for the infinite scroll
    doInfinite(infiniteScroll) {
        
        let paramsUrl = (this.feeds.length > 0) ? this.feeds[this.feeds.length -1].data.name : "";
        
        // Making another fetch with the new params
        this.http.get(this.olderPosts + paramsUrl).map(res => res.json())
            .subscribe (data => {
                this.feeds = this.feeds.concat(data.data.children);
                
                // This can be improved...
                this.feeds.forEach(( e, i ,a ) =>{

                if (!e.data.thumbnail || e.data.thumbnail.indexOf('b.thumbs.redditmedia.com') === -1 ) {

                    e.data.thumnail = 'http://www.redditstatic.com/icon.png';

                }
        
            })
        
        infiniteScroll.complete();
        
        });
        
    }

}
