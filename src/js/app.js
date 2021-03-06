var initialized = false;
var options = {};

Pebble.addEventListener('ready', function(e) {
    console.log("ready called!");
    initialized = true;

    var address = 'https://api.github.com/users/arekom/';
    var access = '?client_id=&client_secret=';

    var UI = require('ui');
    var ajax = require('ajax');
    var accel = require('ui/accel');
    var vibe = require('ui/vibe');

    var splashCard = new UI.Card({
        // banner: 'images/github.png',
        bodyColor: 'tiffanyBlue'
    });
    splashCard.show();

    var mainMenu = new UI.Menu({
        backgroundColor: 'tiffanyBlue',
        textColor: 'black',
        highlightTextColor: 'white',
        sections: [{
            title: 'Main Menu',
            items: [{
                title: 'Followers',
                icon: 'images/followers.png'
            }, {
                title: 'Repositories',
                icon: 'images/repos.png'
            }, {
                title: 'Events',
                icon: 'images/email.png'
            }, {
                title: 'Settings',
                icon: 'images/settings.png'
            }]
        }]
    })

    setTimeout(function() {
        splashCard.hide();
        mainMenu.show();
    }, 1000)

    mainMenu.on('select', function(e) {
        if (e.itemIndex === 0) {
            getFollowers();
        } else if (e.itemIndex === 1) {
            getRepositories();
        } else if (e.itemIndex === 2) {
            getNotifications();
        } else {
            var other = new UI.Card({
                title: 'Settings',
                body: 'Display settings chosen from external configuration page'
            });
            other.show();
        }
    });

    mainMenu.on('accelTap', function(e) {
        getFollowers();
        getRepositories();
        Pebble.showSimpleNotificationOnPebble('Synced!', 'Your data has been successfully sychronized.');
        setTimeout(function(e) {
            mainMenu.show();
        }, 1000);
    });

    function getNotifications() {
        var eventsURL = address + 'events' + access;
        var parseEvents = function(json) {
            var events = [];
            for (var i = 0; i < json.length; i++) {
                var title = json[i].type;
                var subtitle = "by: " + json[i].actor.login;
                events.push({
                    title: title,
                    subtitle: subtitle
                });
            };
            return events;
        }
        ajax({
            url: eventsURL,
            type: 'json'
        }, function(json) {
            var eventItems = parseEvents(json, 10);
            var eventsResultList = new UI.Menu({
                backgroundColor: 'tiffanyBlue',
                textColor: 'black',
                highlightTextColor: 'white',
                sections: [{
                    title: 'Latest Events',
                    items: eventItems
                }]
            });
            eventsResultList.on('select', function(e) {
                var detailsEvent = new UI.Card({
                    body: 'Repo: ' + json[e.itemIndex].repo.name + '\n' + 'Message: ' + json[e.itemIndex].payload.commits[0].message
                });
                detailsEvent.show();
            });
            eventsResultList.show();
        }, function(error) {
            console.log('Loading failed: ' + error)
        })
    }

    function getFollowers() {
        var followersURL = address + 'followers' + access;
        ajax({
            url: followersURL,
            type: 'json'
        }, function(json) {
            var followResultList = new UI.Menu({
                backgroundColor: 'tiffanyBlue',
                textColor: 'black',
                highlightTextColor: 'white',
                sections: [{
                    title: 'Followers',
                    items: [{
                        title: json[0].login
                    }]
                }]
            });
            followResultList.show();
        }, function(error) {
            console.log('Loading failed: ' + error);
        });
        accel.init();
    }

    function getRepositories() {
        var reposURL = address + 'repos' + access;
        var parseRepos = function(json) {
            var items = [];
            for (var i = 0; i < json.length; i++) {
                var title = json[i].name;
                var subtitle = json[i].description;

                items.push({
                    title: title,
                    subtitle: subtitle
                });
            };
            return items;
        }
        ajax({
            url: reposURL,
            type: 'json'
        }, function(json) {
            var repoItems = parseRepos(json, 10);
            var repoResultList = new UI.Menu({
                backgroundColor: 'tiffanyBlue',
                textColor: 'black',
                highlightTextColor: 'white',
                sections: [{
                    title: 'Repositories',
                    items: repoItems
                }]
            });
            repoResultList.on('select', function(e) {
                var details = new UI.Card({
                    title: json[e.itemIndex].name,
                    body: json[e.itemIndex].full_name + '\n' + json[e.itemIndex].description
                });
                details.show();
            });
            repoResultList.show();
        }, function(error) {
            console.log('Loading failed: ' + error);
        });
        accel.init();
    }
});

Pebble.addEventListener("showConfiguration", function() {
    console.log("showing configuration");
    Pebble.openURL('http://arekom.github.io/pebble-github/index.html?' + encodeURIComponent(JSON.stringify(options)));
});

Pebble.addEventListener("webviewclosed", function(e) {
    console.log("configuration closed");
    if (e.response) {
        options = JSON.parse(decodeURIComponent(e.response));
        var result = JSON.stringify(options);
        var res = JSON.parse(result);
        username = res.name;
        console.log(username);
    } else {
        console.log("Cancelled");
    }
});
