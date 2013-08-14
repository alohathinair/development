function ReportScheduleController() {

    this.schedules = [];
    
    this.get_schedules = function(callback) {

        var self = this;

        $.getJSON(WWW_ROOT + "/ajax.php", {
            action: "get_report_schedules"
        }, function(data) {
            self.load_data(data)
            callback();
        });
    };

    this.load_data = function(schedules) {
        this.schedules = [];
        for (var i in schedules) {
            var schedule = new ReportSchedule(schedules[i]);
            schedule.id = i;
            this.schedules.push(schedule);
        }
    };

    this.findScheduleByID = function(id) {
        for (var i in this.schedules) {
            if (this.schedules[i].id == id) {
                return this.schedules[i];
            }
        }

        return null;
    }

    this.remove = function(schedules, callback) {
        var request = {};
        request.action = "delete_report_schedules";
        request.schedules = schedules;

        $.post(WWW_ROOT + "/ajax.php", request,
            function(data) {
                if (callback)
                    callback();
        });
    }
}

function ReportSchedule(conf) {

    var id;

    if (conf) {
        jQuery.extend(this, conf);
        // This parameters come as string, we convert them to booleans
        this.SchedMonday = this.SchedMonday == 'true';
        this.SchedTuesday = this.SchedTuesday == 'true';
        this.SchedWednesday = this.SchedWednesday == 'true';
        this.SchedThursday = this.SchedThursday == 'true';
        this.SchedFriday = this.SchedFriday == 'true';
        this.SchedSaturday = this.SchedSaturday == 'true';
        this.SchedSunday = this.SchedSunday == 'true';

        // Some parameters can be null, give a nice default value
        this.LastRunTime = this.LastRunTime ? this.LastRunTime : 'None';
        this.NextRunTime = this.NextRunTime ? this.NextRunTime : 'Pending';
        this.ScheduleHour = this.ScheduleHour ? this.ScheduleHour : '12';
        this.ScheduleMinute = this.ScheduleMinute ? this.ScheduleMinute : '00';

    } else {
        this.SchedMonday = false;
        this.SchedTuesday = false;
        this.SchedWednesday = false;
        this.SchedThursday = false;
        this.SchedFriday = false;
        this.SchedSaturday = false;
        this.SchedSunday = false;
        this.EmailRecipients = '';
        this.RenderFormat = 'PDF';
        this.ScheduleHour = '12';
        this.ScheduleMinute = '00';
        this.ScheduleAMPM = "PM";
        this.Parameters = new Object();
        this.Parameters.DriverID = 0;
        this.Parameters.GroupID = 0;
        this.Parameters.DeviceID = 0;
    }

    this.isNew = function() {
        return this.ScheduleID == null;
    }

    this.save = function(callback) {
        var schedule = this;
        var request = JSON.parse(JSON.stringify(this));
        request.action = "save_report_schedule";

        $.post(WWW_ROOT + "/ajax.php", request, function(data) {

            // run our callback
            if (callback)
                callback();
            
        }, "json");

    };

    this.remove = function(callback) {
        $.get(WWW_ROOT + "/ajax.php", {
            "action":"delete_report_schedule",
            "ScheduleID": this.ScheduleID
        }, function(data) {
            if (callback)
                callback();
        });

    };
}
