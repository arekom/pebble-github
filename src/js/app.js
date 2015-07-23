// check if ready
Pebble.addEventListener('ready', function(e) {
    var address = 'https://api.github.com/users/arekom/';

    var UI = require('ui');
    var ajax = require('ajax');

    var splashCard = new UI.Card({
        banner: 'images/github.png',
        bodyColor: 'tiffanyBlue'
    });
    splashCard.show();

    var mainMemnu = new UI.Menu({
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
                title: 'Notifications',
                icon: 'images/email.png'
            }, {
                title: 'Settings',
                icon: 'images/settings.png'
            }]
        }]
    })

    setTimeout(function() {
        splashCard.hide();
        mainMemnu.show();
    }, 1000)

    mainMemnu.on('select', function(e) {
        if (e.itemIndex === 0) {
            getFollowers();
        } else if (e.itemIndex === 1) {
            getRepositories();
        }
    });

    function getFollowers() {
        var followersURL = address + 'followers';
        ajax({
            url: followersURL,
            type: 'json'
        }, function(json) {
            var followResultList = new UI.Menu({
                backgroundColor: 'tiffanyBlue',
                textColor: 'orange',
                highlightBackgroundColor: 'electricBlue',
                highlightTextColor: 'black',
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
    }

    function getRepositories() {
        var reposURL = address + 'repos';
        var parseFeed = function(json) {
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
            var menuItems = parseFeed(json, 10);
            var repoResultList = new UI.Menu({
                backgroundColor: 'tiffanyBlue',
                textColor: 'orange',
                highlightBackgroundColor: 'electricBlue',
                highlightTextColor: 'black',
                sections: [{
                    title: 'Repositories',
                    items: menuItems
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
    }
})
