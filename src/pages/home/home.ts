// Time for the 3Ds: Declaration, Decoration and Definition

// Declaration Block
import { Component, ViewChild } from '@angular/core'; // Importing ViewChild component as well
import { NavController, LoadingController, ActionSheetController, Content } from 'ionic-angular'; // Adding ionic controllers
import { InAppBrowser } from 'ionic-native';
import { RedditService } from '../../providers/reddit-service';
import { FormControl } from '@angular/forms'; // This will be used to improve the search filter
import 'rxjs/add/operator/debounceTime'; // This will be used to give the user more time to input the search term
import 'rxjs/add/operator/distinctUntilChanged'; // This will compare the typed terms to avoid unnecessary requisitions

// Decoration Block
@Component({
    
  selector: 'page-home', // Changes in html will only be applied to this component
  templateUrl: 'home.html' // And here, we point to the html template we'll use

})

// Definition Block
export class HomePage {

    @ViewChild(Content) content: Content; // Getting the content component reference
    
    public feeds: Array<any>; // This is where the feed addresses will be stored
    public noFilter: Array<any>; // Here we will store our filterless feed
    public hasFilter: boolean = false; // Here we will check if there's a filter active
    public searchTerm: string = ''; // Declaring the search term variable
    public searchTermControl: FormControl;
    
    private url: string = "https://www.reddit.com/new.json"; // Calling reddit feed
    private newerPosts: string = "https://www.reddit.com/new.json?before=";
    private olderPosts: string = "https://www.reddit.com/new.json?after=";
    
    // Instantiating the classes
    constructor( public navCtrl: NavController, public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController, public redditService: RedditService ) { 
        
        // Grabbing the feed
        this.fetchContent();
        
        // Controlling the search form
        this.searchTermControl = new FormControl;
        this.searchTermControl.valueChanges.debounceTime(1000).distinctUntilChanged().subscribe(search => {
            if(search != '' && search) {
                this.filterItems();
            }
        })
        
        
    }
    
    // Search filter function
    filterItems() {
    
        this.hasFilter = false;
        
        this.feeds = this.noFilter.filter((item) => {
            return item.data.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
        });
    
    }
    
    // Little function to remove the filters
    removeFilters(): void {
    
        // Removing active filters    
        this.noFilter = this.feeds;
        this.hasFilter = false;
        
    }
    
    // Here we fetch the content, this function is called by the constructor
    fetchContent(): void { 
    
        // Initializing the loading
        let loading = this.loadingCtrl.create({
            content: 'Fetching content...' // Here we define the message displayed to the user
        });
        
        // Presenting the loading message to the user
        loading.present();
        
        // Fetching the data from our service provider
        this.redditService.fetchData(this.url).then(data => {
            
            // Setting the feed results
            this.feeds = data;
        
            // Storing the feed without filters
            this.noFilter = this.feeds;

            // Loading is finish, so let's kill the messenger
            loading.dismiss();
        
        })
  
    }
    
    // Here we fetch the new contents when refreshing
    doRefresh(refresher) {
        
        // Grabbing the name of the first post
        let paramsUrl = this.feeds[0].data.name;
        
        // Fetching recent posts
        this.redditService.fetchData(this.newerPosts + paramsUrl).then(data => {
        
            // Adding more content to the feeds Array
            this.feeds = data.concat(this.feeds);
                
            this.removeFilters();
        
            refresher.complete();
        
        })
               
    }
    
    // Here we fetch the contents for the infinite scroll
    doInfinite(infiniteScroll) {
        
        // Grabbing the name of the last post
        let paramsUrl = (this.feeds.length > 0) ? this.feeds[this.feeds.length -1].data.name : "";
        
        // Making another fetch with the new params
        this.redditService.fetchData(this.olderPosts + paramsUrl).then(data => {
                
            // Adding more content to the feeds Array               
            this.feeds = this.feeds.concat(data); 
                
            this.removeFilters();
        
            infiniteScroll.complete();
        
        })
             
    }
    
    // This is the function that gets called by the click event defined in the html
    itemSelected(url: string):void {
        
        let browser = new InAppBrowser(url, '_system'); // Openning the link in the InAppBrowser
        
    }
    
    // Filter implementation - I think I can turn this into a loop
    // at least the handler part of it... gotta research!
    showFilters(): void {
    
        // Here we use the content component, to make the app always scrolls to the top when adding a filter
        this.content.scrollToTop();
    
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
