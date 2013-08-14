
function LandmarkImportManager() {

    var self = this;
    this.landmarks = [];

    $("#import-errors-close").click(function() {
        $("#import-errors").hide("slow");
    })

    this.uploader = new qq.FileUploader({
        element: $("#file-uploader")[0],
        action: '/ajax.php',
        params: {action: "process_landmarks_file"},
        allowedExtensions: ["csv"],
        template: '<div class="qq-uploader">' +
                '<div class="qq-upload-drop-area"><span>Drop files here to upload</span></div>' +
                'Click <div class="qq-upload-button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only">Upload File</div> to import a CSV file | <a href="/static/LandmarksImportTemplate.csv">Download Template</a>' +
                '<ul class="qq-upload-list"></ul>' +
            '</div>',
        onComplete: function(id, fileName, data) {
            self.process_result(data.landmarks);
        }
    });

    $("#import-landmark-dialog").dialog({
            autoOpen: false,
            draggable: true,
            resizable: false,
            width: 700,
            height: 550,
            title: 'Import Landmarks',
            modal: true,
            buttons: {
			'Import':function() {
                            self.import_landmarks();
                        }
            }

    });

    this.open_dialog = function() {
        $("#import-landmark-dialog").dialog("open");
    }

    this.has_landmarks = function() {
        return this.landmarks.length > 0;
    };

    this.get_valid_landmarks = function() {
        var result = [];
        for (var i = 0; i < this.landmarks.length; ++i) {
            var landmark = this.landmarks[i];
            if (landmark.has_valid_location())
                result.push(landmark);
        }
        return result;
    }

    this.is_processing = function() {
        for (var i = 0; i < this.landmarks.length; ++i) {
            var landmark = this.landmarks[i];
            if (landmark.processing)
                return true;
        }
        return false;
    }

    this.import_landmarks = function() {

        if (!this.has_landmarks()) {
            alert('There are no landmarks to import. Please Upload a File with Landmarks.');
            return;
        }

        if (this.is_processing()) {
            alert('The landmarks are still processing, please wait a few seconds and try again.');
            return;
        }


        var valid_landmarks = $.merge([], this.get_valid_landmarks());

        if (valid_landmarks.length == 0) {
            alert('There are no valid landmarks, please Upload a File with valid Landmarks.')
        }

        $("body").mask("Saving...");
        
	$.post(WWW_ROOT + "/ajax.php", {
                action: "save_imported_landmarks",
                landmarks: valid_landmarks
            },

            function(data) {
                $("#import-landmark-dialog").dialog("close");
                reload_landmarks();
                $("body").unmask();
            });
        
    };

    this.landmark_to_row = function(landmark) {
        var result = "<tr id='landmark-row-" + landmark.row + "'";
        
        if (!landmark.valid) 
            result += " class='import-error'";
        
        result += ">";
        result += "<td>" + landmark.row + '</td>';
        result += "<td>" + landmark.name + '</td>';
        result += "<td>" + landmark.address + '</td>';

        var text = "";
        if (landmark.processing) text = "Processing..."
        else text = landmark.get_location();

        result += "<td><span class='import-landmark-location' id='landmark-location-" + landmark.row + "'>" + text + '</span></td>';
        result += '</tr>';
        return result;

    };

    this.update_landmark = function(landmark) {
        var selRow = "#landmark-row-" + landmark.row;
        var selLocation = "#landmark-location-" + landmark.row;
        if (landmark.has_valid_location()) {
            $(selLocation).html(landmark.get_location());
        } else {
            $(selLocation).html("Could not resolve address");
            $(selRow).addClass("import-error");
        }
    };

    this.process_result = function(landmarks, errors) {
        var self = this;
        $("#import-landmarks-container").show();
        var html = "";
        for (var i = 0; i < landmarks.length; ++i) {
            
            var landmark = landmarks[i];

            landmark.has_valid_location = function() {
                return (this.lat && this.lng && !isNaN(this.lat) && !isNaN(this.lng));
            }

            landmark.get_location = function() {
                return "" + this.lat + ', ' + this.lng;
            }

            landmark.needs_geocode = function() {
                return this.valid && !this.has_valid_location();
            }

            landmark.resolve_address = function() {
                if (!this.processing) return;
                
                var l = this;
                geocode(l.address, function(lat, lng) {
                    l.lat = lat;
                    l.lng = lng;
                    l.processing = false;
                    self.update_landmark(l);
                });
            }
            
            landmark.processing = landmark.needs_geocode();

            html += this.landmark_to_row(landmark);
        }

        $("#import-landmarks-list").html(html);
        this.landmarks = landmarks;

        for (var i = 0; i < landmarks.length; ++i) {
            var landmark = landmarks[i];

            if (landmark.needs_geocode()) {
                landmark.resolve_address();
            }
        }

    }

}


