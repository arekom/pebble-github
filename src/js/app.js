var UI = require('ui');
var ajax = require('ajax');

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

var splashCard = new UI.Card({
    title: 'Please Wait',
    body: 'Loading request...',
    bodyColor: 'tiffanyBlue',
    titleColor: 'orange',
    font: 'GOTHIC_14'
});
splashCard.show();

var URL = 'https://api.github.com/users/arekom/repos';

ajax({
    url: URL,
    type: 'json'
}, function(json) {
    var menuItems = parseFeed(json, 10);
    var resultList = new UI.Menu({
        backgroundColor: 'tiffanyBlue',
        textColor: 'orange',
        highlightBackgroundColor: 'electricBlue',
        highlightTextColor: 'black',
        sections: [{
            title: 'Repositories',
            items: menuItems
        }]
    });
    resultList.show();
    splashCard.hide();

    resultList.on('select', function(e) {
        var details = new UI.Card({
            title: 'Details for:',
            body: json[e.itemIndex].name
        });
        details.show();
    });


}, function(error) {
    console.log('Loading failed: ' + error);
});
