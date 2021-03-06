import Weather from './components/Weather'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'weather-icons/css/weather-icons.css'
import React, { Component } from 'react'
import Form from './components/Form'
import { Helmet } from "react-helmet"




export default class App extends Component {

  constructor() {
    super()
    this.state = {
      city: undefined,
      country: undefined,
      icon: undefined,
      main: undefined,
      celsius: undefined,
      temp_max: undefined,
      temp_min: undefined,
      description:'',
      error: false
    }

    this.weatherIcon = {
      Thunderstorm: 'wi-thunderstorm',
      Drizzle: 'wi-sleet',
      Rain: 'wi-storm-showers',
      Snow: 'wi-snow',
      Atmosphere: 'wi-fog',
      Clear: 'wi-day-sunny',
      Clouds: 'wi-day-fog'
    }
  }
 // function to format the celsius data from api correctly
  calculateCelsius(temp) {
    let cel = Math.floor(temp - 273.15)
    return cel;
  }

  // function that will assign the relevant weather icon depending on the weather forecast received from the api. done via the icon id provided by the api

  getWeatherIcon( icons, rangeID ) {
    switch ( true ) {
      case rangeID >= 200 && rangeID <= 232:
        this.setState({ icon: this.weatherIcon.Thunderstorm })
        break;
      case rangeID >= 300 && rangeID <= 321:
        this.setState({ icon: this.weatherIcon.Drizzle })
        break;
      case rangeID >= 500 && rangeID <= 531:
        this.setState({ icon: this.weatherIcon.Rain })
        break;
      case rangeID >= 600 && rangeID <= 622:
        this.setState({ icon: this.weatherIcon.Snow })
        break;
      case rangeID >= 701 && rangeID <= 781:
        this.setState({ icon: this.weatherIcon.Atmosphere })
        break;
      case rangeID === 800:
        this.setState({ icon: this.weatherIcon.Clear })
        break;
      case rangeID >= 801 && rangeID <= 804:
        this.setState({ icon: this.weatherIcon.Clouds })
        break;
      default:
        this.setState({ icon: this.weatherIcon.Clouds })
    }
  }

  //API CALL api.openweathermap.org/data/2.5/weather?q=London&appid={API key}
 //function to pull the weather data from the weather api asynchronously
  getWeather = async ( e ) => {

    e.preventDefault();

    const city = e.target.elements.city.value;

    const country = e.target.elements.country.value;

      
    if(city && country) {

      const api_call = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${process.env.REACT_APP_API_KEY}`);

      const response = await api_call.json();

      // uses the data from the api to change the states created, to be passed as props to be rendered in weather component
      this.setState({
        city: `${ response.name}, ${ response.sys.country }`,
        country: response.sys.country,
        celsius: this.calculateCelsius(response.main.temp),
        temp_max: this.calculateCelsius(response.main.temp_max),
        temp_min: this.calculateCelsius(response.main.temp_min),
        description: response.weather[0].description,
        error: false
      })

      this.getWeatherIcon(this.weatherIcon, response.weather[0].id);
      
    } else {
      this.setState({ error: true });
    }
  }
  render() {
    return (
      <div className='App'>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Weather App</title>
          <link rel="canonical" href="http://Shakadeliks.github.io/weather-app" />
        </Helmet>
        <Form loadWeather={ this.getWeather } error={ this.state.error }/>
        <Weather 
          city={ this.state.city } 
          country={ this.state.country }
          temp_celsius={ this.state.celsius }
          temp_max={ this.state.temp_max }
          temp_min={ this.state.temp_min }
          description={ this.state.description }
          weatherIcon={ this.state.icon } 
        />
      </div>
    )
  }
}
