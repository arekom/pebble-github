var UI = require('ui');
var ajax = require('ajax');
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
    var resultList = new UI.Menu({
        backgroundColor: 'tiffanyBlue',
        textColor: 'orange',
        highlightBackgroundColor: 'electricBlue',
        highlightTextColor: 'black',
        sections: [{
            title: 'Repositories',
            items: [{
                title: json[0].name,
                subtitle: json[0].description
            }, {
                title: json[1].name,
                subtitle: json[1].description
            }, {
                title: json[2].name,
                subtitle: json[3].description
            }]
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
    })

}, function(error) {
    console.log('Loading failed: ' + error);
});
