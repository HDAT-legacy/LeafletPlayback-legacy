L.Playback = L.Playback || {};

L.Playback.DataStream = L.Class.extend({
    //!!! ENTIRE CLASS MOCKED !!! WILL NOT WORK PROBABLY !!!

    // what should this do?... Should it be here?
    // Let write it without buffer for now. Everything that contains a certain 
    //timestamp should be know to the lower program.
    
    // Should have somekind of header information. An array with the start and 
    // end time of every voyage. 

    getDataLight : function() {
        // this contruct an lightweight array without the actual data, 
        // only voyID, start and end time. It should derive this from the arraykeys
        return dataRange;
    },

    getDataFull : function(trackID, addData) {
        // some firebase or socket code, for now window with 
        // mocking asynchronicity (for latency) with timeout
        var asyncMock = function (trackID){
            var track = window.allTracks[trackID];
            addData(track, this.getTime());
        };

        window.setTimeout(asyncMock, 10, trackID, addtrack);

        return track;
    },

    appropriateTracks : function(dataLight, previousData, timestamp){
        // Check dataLight for suitable tracks
        var appropriateTracks = dataRange.map(function(index, track){
            if (    timestamp > track.startTime 
                &&  timestamp < track.endTime) {
                return track;
            }
        });
        return appropriateTracks;
    },

    addKeepOrRemoveTracks : function(appropriateTracks){

        var toBeAddedTracks = [];

        if (appropriateTracks.length == 0) {
            // this.clearData();
            return;
        } else {
            toBeAddedTracks = appropriateTracks.map(
                function(track, index){
                    // Check if track is already available,
                    // If not return the it to be queued for adding
                    if (!this._trackController.isTrack(track.id)){
                        return track;
                    } 
                }
            )
        }

        // Still needs conditional for removal of tracks! Although that might not
        // be need at all. Only if memory gets overloaded, but I suppose that 
        // should take a while. Bandwidth and response time worry me more.

        toBeAddedTracks.map(function(track, index){
            // get full data, and use vendor addData to add it to the tracks
            var fullTrack = getFullData(track.trackID, this.addData);

            // from playback
            this._trackController.addTrack(new L.Playback.Track(fullTrack, this.options), ms);
        })
    }
});