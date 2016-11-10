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
    public noFilter: Array<any>; // Here we will store our filterless feed
    public hasFilter: boolean = false; // Here we will check if there's a filter active
    
    private url: string = "https://www.reddit.com/new.json"; // Calling reddit feed
    private newerPosts: string = "https://www.reddit.com/new.json?before=";
    private olderPosts: string = "https://www.reddit.com/new.json?after=";
    
    // Instantiating the classes
    constructor(
        public navCtrl: NavController, 
        public http: Http, 
        public loadingCtrl: LoadingController, 
        public actionSheetCtrl: ActionSheetController
    ) { 
        
        this.fetchContent();
        
    }
    
    removeFilters():void {
    
        // Removing active filters    
        this.noFilter = this.feeds;
        this.hasFilter = false;
        
    }
    
    fixThumbnails():void {
        
        // Dealing with broken thumbnails
        this.feeds.forEach(( e, i, a ) => {

        if (!e.data.thumbnail || e.data.thumbnail.indexOf('b.thumbs.redditmedia.com') === -1 ) {

        // Setting the default thumbnail
            e.data.thumbnail = 'http://www.redditstatic.com/icon.png';

            }
        }
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
                
                this.fixThumbnails();

                })
            
            // Storing the feed without filters
            this.noFilter = this.feeds;
            
            // Loading is finish, so let's kill the messenger
            loading.dismiss();
                
        });
    }
    
    // Here we fetch the new contents when refreshing
    doRefresh(refresher) {
        
        // Grabbing the name of the first post
        let paramsUrl = this.feeds[0].data.name;
        
        // Fetching recent posts
        this.http.get(this.newerPosts + paramsUrl).map(res => res.json())
            .subscribe(data =>{
        
                // Adding more content to the feeds Array
                this.feeds = data.data.children.concat(this.feeds);
                
                this.fixThumbnails();
        
            })
            
        this.removeFilters();
        
        refresher.complete();
            
        });   
    }
    
    // Here we fetch the contents for the infinite scroll
    doInfinite(infiniteScroll) {
        
        // Grabbing the name of the last post
        let paramsUrl = (this.feeds.length > 0) ? this.feeds[this.feeds.length -1].data.name : "";
        
        // Making another fetch with the new params
        this.http.get(this.olderPosts + paramsUrl).map(res => res.json())
            .subscribe (data => {
                
                // Adding more content to the feeds Array               
                this.feeds = this.feeds.concat(data.data.children); 
                
                this.fixThumbnails();
        
            })
            
        this.removeFilters();
        
        infiniteScroll.complete();
        
        });     
    }
    
    // This is the function that gets called by the click event defined in the html
    itemSelected(url: string):void {
        
        let browser = new InAppBrowser(url, '_system'); // Openning the link in the InAppBrowser
        
    }
    
    // Filter implementation - I think I can turn this into a loop
    // at least the handler part of it... gotta research!
    showFilters():void {
    
        // Creating the controller - Made public in the constructor
        let actionSheet = this.actionSheetCtrl.create({
        
            title: 'Filter options:', 
            buttons: [
                {
                    text: 'Music',
                    handler: () => {
                        // Setting the filter
                        this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === 'music');
                        this.hasFilter = true;
                    }
                },
                {
                    text: 'Movies',
                    handler: () => {
                        // Setting the filter
                        this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === 'movies');
                        this.hasFilter = true;
                    }
                },
                {
                    text: 'Games',
                    handler: () => {
                        // Setting the filter
                        this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === 'games');
                        this.hasFilter = true;
                    }
                },
                {
                    text: 'Pictures',
                    handler: () => {
                        // Setting the filter
                        this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === 'pictures');
                        this.hasFilter = true;
                    }
                },
                {
                    text: 'Ask Reddit',
                    handler: () => {
                        // Setting the filter
                        this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === 'askreddit');
                        this.hasFilter = true;
                    }
                },
                {
                    text: 'Cancel',   
                    role: 'cancel',
                    handler: () => {
                        // Removing the filter
                        this.feeds = this.noFilter;
                        this.hasFilter = false;
                    }
                }
            ]
        });
        
        actionSheet.present();
    
    }
}
