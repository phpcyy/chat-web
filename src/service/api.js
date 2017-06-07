import fetch from 'whatwg-fetch'
let post = function () {
    "use strict";
    fetch('flowers.jpg').then(function (response) {
        if (response.ok) {
            response.blob().then(function (myBlob) {

            });
        } else {
            console.log('Network response was not ok.');
        }
    }).catch(function (error) {

    });
};