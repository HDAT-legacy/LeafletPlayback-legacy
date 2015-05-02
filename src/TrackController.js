L.Playback = L.Playback || {};

L.Playback.TrackController = L.Class.extend({

    initialize : function (map, tracks, options) {
        this.options = options || {};
    
        this._map = map;

        this._tracks = [];
    },
    
    clearTracks: function(){
        //? called by setData, does what is expected of it. And by setTracks it seems. Wonder what that's all about.
        while (this._tracks.length > 0) {
            var track = this._tracks.pop();
            var marker = track.getMarker();
            
            if (marker){
                this._map.removeLayer(marker);
            }
        }            
    },
    
    // add single track
    addTrack : function (track, timestamp) {
        // return if nothing is set
        //? Important method.
        if (!track) {
            return;
        }

        console.log(track);

        var marker = track.setMarker(timestamp, this.options);

        if (marker) {
            marker.addTo(this._map);
            
            this._tracks.push(track);
        }            
    },

    removeTrack : function(track){
        //!!! This needs to be written. Tracks must be given some recognisable id by the when created. Or they must simply be compared in de _tracks array. 
    },

    tock : function (timestamp, transitionTime) {
        for (var i = 0, len = this._tracks.length; i < len; i++) {
            var lngLat = this._tracks[i].tick(timestamp);
            var latLng = new L.LatLng(lngLat[1], lngLat[0]);
            this._tracks[i].moveMarker(latLng, transitionTime);
        }
    },

    getStartTime : function () {
        var earliestTime = 0;

        if (this._tracks.length > 0) {
            earliestTime = this._tracks[0].getStartTime();
            for (var i = 1, len = this._tracks.length; i < len; i++) {
                var t = this._tracks[i].getStartTime();
                if (t < earliestTime) {
                    earliestTime = t;
                }
            }
        }
        
        return earliestTime;
    },

    getEndTime : function () {
        var latestTime = 0;
    
        if (this._tracks.length > 0){
            latestTime = this._tracks[0].getEndTime();
            for (var i = 1, len = this._tracks.length; i < len; i++) {
                var t = this._tracks[i].getEndTime();
                if (t > latestTime) {
                    latestTime = t;
                }
            }
        }
    
        return latestTime;
    },

    getTracks : function () {
        return this._tracks;
    }
});