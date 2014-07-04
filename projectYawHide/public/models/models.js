
var GetSobeysFlyer = Backbone.Model.extend({
	url:  getURL('/projectYawHide/getAllStores') 
});


/**
* Gets the Nearest Sobeys collection
* @param {options} - latitude, and longitude
* @return {collection} - Nearest Collection
*/
var GetNearestSobeys = Backbone.Collection.extend({
    initialize: function(options){
        this.elat = options.elat;
        this.elong = options.elong;
        this.maxD = options.maxD;
    },
    url: function(){
        return getURL('/projectYawHide/getNearestStores/') +this.elat+'/'+this.elong+'/'+this.maxD;
    }
}); 

var GetNearestByPostal = Backbone.Collection.extend({
    initialize: function(options){
        this.postal = options.postal;
        this.maxD = options.maxD;
    },
    url: function(){
        return getURL('/projectYawHide/getNearestByPostal/') +this.postal+'/'+this.maxD;
    }
}); 

var GetOneSobeyStore = Backbone.Model.extend({
    initialize: function(options){
        this.id = options.id;
    },
    url: function(){
        return getURL('/projectYawHide/viewFlyer/') +this.id;
    }
}); 

var GetLatLongFromPostal = Backbone.Model.extend({
    initialize: function(options){
        this.postal = options.postal;
    },
    url: function(){
       return "http://query.yahooapis.com/v1/public/yql?q=select * from geo.places where text='" + this.postal + "'&format=json";
     //   return "http://query.yahooapis.com/v1/public/yql?q=select * from geo.places where text='" + this.postal + "'";
    }
});


