'use strict'

let userState;
let userCityInput;
let userStateInput;
let rain = $('#rain');
let lochumidity = $('#humidity');
let wind = $('#wind');
// let UV = $('.we-de-UVIndex>span');
let currentDescription = $('#currentDescription');
let currentDegree = $('#currentDegree');
let overallSummary = $('#weather-summary');
let userCurrentCity = $('#user-location-city');
let feelsLike = $('#feelsLike');
let weatherHigh = $('#high');
let weatherLow = $('#low');

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
                // Display elements in DOM
                currentDegree.text(Math.floor(temperature));
                currentDescription.text(summary);
                rain.text(Math.floor(precipProbability));
                lochumidity.text(Math.floor(humidity));
                wind.text(Math.floor(windSpeed));
                overallSummary.text(data.daily.data[0].summary);
                feelsLike.text(Math.floor(apparentTemperature));
                weatherHigh.text(Math.floor(apparentTemperatureHigh));
                weatherLow.text(Math.floor(apparentTemperatureLow));
                })
            getUserState(long, lat)
        }); 
    }else{
        alert ('Please allow browser to user location');
    }
    listenForSearch()
}


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
        $(userCurrentCity).text(`${responseJson.address.city}`)
        console.log (userState);
        getParks(userState)
    })
    .catch(err => {
      $('.errorMessage').text(`Something went wrong: ${err.message}`);
    });
    }

    // Use user,s state to call parks API 
    function getParks(userState){
        const parkKey= 'RaYswaUxaB9BWohOoxp1qBuF5mSz9pFYsvP7NOWo'
        fetch(`https://developer.nps.gov/api/v1/places?q=${userState}&api_key=${parkKey}&limit=9`)
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
                            <img src="${array[i].listingimage.url}" alt="Todo List screenshot" class="projectImage" />
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
     const userState = userStateInput;     
     const userLong = responseJson[0].lon;
     const userLat = responseJson[0].lat;
     $(userCurrentCity).text(`${userCityInput}`)
     console.log (userState);
     getParks(userState)
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
            // Display elements in DOM
            currentDegree.text(Math.floor(temperature));
            currentDescription.text(summary);
            rain.text(Math.floor(precipProbability));
            lochumidity.text(Math.floor(humidity));
            wind.text(Math.floor(windSpeed));
            overallSummary.text(data.daily.data[0].summary);
            feelsLike.text(Math.floor(apparentTemperature));
            weatherHigh.text(Math.floor(apparentTemperatureHigh));
            weatherLow.text(Math.floor(apparentTemperatureLow));
            })
    }

    function listenForSearch(){
        $('#search-form').on('click', '.searchButton', function(e){
            e.preventDefault();
            $('.displayedResults').empty();
            userCityInput = $('#user-city').val();
            userStateInput = $('#user-state').val();
            console.log(`city = ${userCityInput} state= ${userStateInput}`);
            console.log('search buttton clicked');
            getUserCords(userCityInput, userStateInput)
        });
    }


$(initialize)