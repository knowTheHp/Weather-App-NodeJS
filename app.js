const yargs = require('yargs');
const axios = require('axios');

const argv = yargs.options({
    a:{
        alias:'address',
        demand:true,
        description:'use --a or --address command to pass an address',
        string:true
    }
}).help()
.alias('help','h').argv;

//Encode user inpu to a valid URI
const encodeAddress = encodeURIComponent(argv.address);

//geoURL
const getGeocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeAddress}`;

//get the response back from getGeocodeURL
axios.default.get(getGeocodeURL).then((response)=>{
    if (response.data.status==='ZERO_RESULTS') {
        throw new Error('unable to find that address');
    }
    //fetch the lat and lng from the getGeocodeURL
var lat=response.data.results[0].geometry.location.lat;
var lng=response.data.results[0].geometry.location.lng;

//pass them to the weatherURL
var weatherURL = `https://api.darksky.net/forecast/457b9b07884af144f28a5f406300e7f5/${lat},${lng}`;

//fetch the weather data 
return axios.default.get(weatherURL);
}).then((res)=>{
    //fetch the temp from weather data
    var temperature= res.data.currently.temperature;
    var apparentTemperature=res.data.currently.apparentTemperature;
    //log it
console.log(`The current temperature is ${temperature} but it feels like ${apparentTemperature}`);
}).catch((error)=>{
    if (error.code==='ENOTFOUND') {
        console.log('API link is invalid');
    }else{
        console.log(error);
    }
});
