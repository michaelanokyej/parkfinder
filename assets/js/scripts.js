'use strict'

let userState;
let userCityInput;
let userStateInput;
let rain = $('#rain');
let lochumidity = $('#humidity');
let wind = $('#wind');
let weatherIcon = $('#weatherIcon');
// let UV = $('.we-de-UVIndex>span');
let currentDescription = $('#currentDescription');
let currentDegree = $('#currentDegree');
let overallSummary = $('#weather-summary');
let parkResults = $('h1.results');
// let userCurrentCity = $('#user-location-city');
let feelsLike = $('#feelsLike');
let weatherHigh = $('#high');
let weatherLow = $('#low');
let getnewicon;

// Initial function to run when page loads 
function initialize(){
    let long;
    let lat;

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
            console.log(position);
            long = position.coords.longitude;
            lat = position.coords.latitude;
            console.log(`long = ${long} and lat = ${lat} `);

            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const weatherURL =`${proxy}https://api.darksky.net/forecast/0c2f73d8efc4b088e536ea18dc777461/${lat},${long}`;
            fetch(weatherURL)
            .then(response => response.json()) 
            .then(data => {
                console.log(data);
                const {temperature, summary, humidity, windSpeed, apparentTemperature} = data.currently;
                const {precipProbability, apparentTemperatureLow, apparentTemperatureHigh} = data.daily.data[0];
                getnewicon = data.hourly.data[0].icon;
                // Display elements in DOM
                currentDegree.text(Math.floor(temperature)+'°');
                currentDescription.text(summary);
                rain.text(Math.floor(precipProbability)+'°');
                lochumidity.text(Math.floor(humidity)+ '%');
                wind.text(Math.floor(windSpeed)+'mph');
                overallSummary.text(data.daily.data[0].summary);     
                feelsLike.text(Math.floor(apparentTemperature)+'°');
                weatherHigh.text(Math.floor(apparentTemperatureHigh)+'°');
                weatherLow.text(Math.floor(apparentTemperatureLow)+'°');

                console.log(getnewicon);
                if(getnewicon === "clear-day"){
                    weatherIcon.attr('src', 'assets/images/clear-day.png');
                }else{
                    weatherIcon.attr('src', 'assets/images/partly-cloudy-day.png');
                }
                })
            // getWeatherIcon(getnewicon)
            getUserState(long, lat)
        }); 
    }else{
        alert ('Please allow browser to user location');
    }
    listenForSearch()
    // listenForHover()
}

// function listenForHover(){
// $('.displayedResults').on('mouseenter', '.projectLi', function( event ) {
//     $(this).find(".description").css({"display": "flex"}); 
// }).on('mouseleave', '.projectLi', function( event ) {
//     $(this).find(".description").css({"display": "none"}); 
// });
// }

// Reverse geocode user's long 
// and latitude to get user's state 
    function getUserState(long, lat){
       const addURL = `https://us1.locationiq.com/v1/reverse.php?key=ee9597797b2280&lat=${lat}&lon=${long}&format=json`;
       fetch(addURL)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        throw new Error(response.statusText)
    })
    .then(responseJson => {
        console.log(responseJson);
        userState = responseJson.address.state;
        $(parkResults).text(`Parks near ${responseJson.address.city}`);
        // $(userCurrentCity).text(``)
        console.log (userState);
        getParks(userState)
    })
    .catch(err => {
      $('.errorMessage').text(`Something went wrong: ${err.message}`);
    });
    }

    // Use user's state to call parks API 
    function getParks(userState){
        const parkKey = 'RaYswaUxaB9BWohOoxp1qBuF5mSz9pFYsvP7NOWo';
        const  url = `https://developer.nps.gov/api/v1/places?q=${userState}&api_key=${parkKey}&limit=9`;
        fetch(url)
        .then(response => {
            if(response.ok){
                return response.json();
            }
            throw new Error(response.statusText)
        })
        // .then(responseJson => displayResults(responseJson))
        .then(responseJson => {
            console.log(responseJson)
            displayResults(responseJson)
        })
        .catch(err => {
          $('.errorMessage').text(`Something went wrong: ${err.message}`);
        });
    
        function displayResults(responseJson){
            let array = responseJson.data;
            if(array === undefined || array.length === 0){
                alert('Sorry, something went wrong, check input.');
            }else{
                for(let i=0; i < array.length; i++){
                    $('.displayedResults').append(`
                    <li class="projectLi"> 
                        <div class="title">${array[i].title}</div>
                        <div class="imgWrapper">
                            <img src="${array[i].listingimage.url}" alt="Park photo" class="projectImage" />
                        </div>
                        <div class="paraWrapper">
                            <p class="center description">${array[i].listingdescription}</p>
                        </div>
                        <div class="park-links">
                            <a href="${array[i].url}" class ="parkButton" target="_blank">Go to park</a> 
                        </div>
                    </li>
                    `)
                }
            }
            $('h1.results').removeClass('hidden');
        }
    }






// Handling user input 
function getUserCords(userCityInput, userStateInput){
    const addURL = `https://us1.locationiq.com/v1/search.php?key=ee9597797b2280&format=json&city=${userCityInput}&state=${userStateInput}`;
        fetch(addURL)
    .then(response => {
     if(response.ok){
         return response.json();
     }
     throw new Error(response.statusText)
 })
    .then(responseJson => {
     console.log(responseJson);
     const userLong = responseJson[0].lon;
     const userLat = responseJson[0].lat;
     $(userCurrentCity).text(`${userCityInput}`)
     console.log (userState);
     getWeather(userLong,userLat)
 })
 .catch(err => {
   $('.errorMessage').text(`Something went wrong: ${err.message}`);
 });
 } 
 
 
    function getWeather(userLong, userLat){
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const weatherURL =`${proxy}https://api.darksky.net/forecast/0c2f73d8efc4b088e536ea18dc777461/${userLat},${userLong}`;
        fetch(weatherURL)
        .then(response => response.json()) 
        .then(data => {
            console.log(data);
            const {temperature, summary, humidity, windSpeed, apparentTemperature} = data.currently;
            const {precipProbability, apparentTemperatureLow, apparentTemperatureHigh} = data.daily.data[0];
            getnewicon = data.hourly.icon;
            // Display elements in DOM
            currentDegree.text(Math.floor(temperature)+'°');
            currentDescription.text(summary);
            rain.text(Math.floor(precipProbability)+'°');
            lochumidity.text(Math.floor(humidity)+'%');
            wind.text(Math.floor(windSpeed)+'mph');
            overallSummary.text(data.daily.data[0].summary);
            feelsLike.text(Math.floor(apparentTemperature)+'°');
            weatherHigh.text(Math.floor(apparentTemperatureHigh)+'°');
            weatherLow.text(Math.floor(apparentTemperatureLow)+'°');

            console.log(getnewicon);
            if(getnewicon === "clear-day"){
                weatherIcon.attr('src', 'assets/images/clear-day.png');
            }else{
                weatherIcon.attr('src', 'assets/images/partly-cloudy-day.png');
            }
        })
    }

    function getnewParks(userState){
        const parkKey = 'RaYswaUxaB9BWohOoxp1qBuF5mSz9pFYsvP7NOWo';
        const  url = `https://developer.nps.gov/api/v1/parks?stateCode=${userState}&api_key=${parkKey}&limit=9`;
        fetch(url)
        .then(response => {
            if(response.ok){
                return response.json();
            }
            throw new Error(response.statusText)
        })
        // .then(responseJson => displayResults(responseJson))
        .then(responseJson => {
            console.log(responseJson)
            displayNewResults(responseJson)
        })
        .catch(err => {
          $('.errorMessage').text(`Something went wrong: ${err.message}`);
        });

        function displayNewResults(responseJson){
            let array = responseJson.data;
            if(array === undefined || array.length === 0){
                alert('Sorry, something went wrong, check input.');
            }else{
                for(let i=0; i < array.length; i++){
                    $('.displayedResults').append(`
                    <li class="projectLi"> 
                        <div class="title">${array[i].name}</div>
                        <div class="paraWrapper">
                            <p class="center description">${array[i].description}</p>
                        </div>
                        <div class="park-links">
                            <a href="${array[i].url}" class ="parkButton" target="_blank">Go to park</a> 
                        </div>
                    </li>
                    `)
                }
            }
            $('h1.results').removeClass('hidden');
        }
    }

    function listenForSearch(){
        $('#search-form').on('click', '.searchButton', function(e){
            e.preventDefault();
            $('.displayedResults').empty();
            userCityInput = $('#user-city').val();
            userStateInput = $('#user-state').val();
            $(parkResults).text(`Parks near ${userCityInput}`);
            console.log(`city = ${userCityInput} state= ${userStateInput}`);
            console.log('search buttton clicked');
            getUserCords(userCityInput, userStateInput)
            userState = userStateInput;  
            getnewParks(userState)           
        });
        // listenForHover()
    }


$(initialize)
