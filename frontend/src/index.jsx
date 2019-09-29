import React from 'react';
import ReactDOM from 'react-dom';

let defaultLocation = {
  latitude: 60,
  longitude: 50
}
 let currentWeather = {}

const baseURL = process.env.ENDPOINT;
  
const getWeatherFromApi = async (position) => {
  try {
    const response = await fetch(`${baseURL}/weather?lat=${position.latitude}&lon=${position.longitude}`);
    return response.json();
  } catch (error) {
    console.error(error);
  }

  return {};
};

const locate = new Promise( async (resolve, reject )=> {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log('geolocated');
        const localWeather = await getWeatherFromApi (position.coords)
        console.log(localWeather);
        currentWeather = localWeather;
        resolve('done');
      }
    )
  } else {
    const defaultWeather = await getWeatherFromApi (defaultLocation);
    console.log('defaulted');
    currentWeather = defaultWeather;
    resolve('done');
  }
}
)

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentIcon: '',
      currentType: '',
      time: '',
      comingWeather: []
    };
  }

  async componentWillMount() {
    console.log('Component mount');
    locate.then((weather) => {
      console.log(weather);
      console.log(currentWeather);
      for (let i = 0; i < currentWeather.length; i++){
        if (i === 0){
          this.setState({currentIcon: currentWeather[0].weather[0].icon.slice(0, -1), currentType: currentWeather[0].weather[0].main, time: currentWeather[0].dt_txt });
        } else {
          const newWeather = { icon: currentWeather[i].weather[0].icon.slice(0, -1), type: currentWeather[i].weather[0].main, time:currentWeather[i].dt_txt };
          this.setState({
            comingWeather: this.state.comingWeather.concat([newWeather])
          })
          console.log(this.state.comingWeather);
        }
      }
    });
    console.log('located')
  }

  render() {
    const { currentIcon, currentType, time } = this.state;
    let comingWeather = [];
    for (const weather of this.state.comingWeather) {
      comingWeather.push(
        <div className="weatherCard">
          <h3>{weather.type}</h3>
          { weather.icon && <img src={`/img/${weather.icon}.svg`} /> }
          <p>({weather.time})</p>
        </div>
      )
    } 
    return (
        <div className="icon">
          <div className="weatherCard">
            <h1>Weather</h1>
            <h2>Current</h2>
            <h2>{currentType}</h2>
            { currentIcon && <img src={`/img/${currentIcon}.svg`} /> }
            <p>({time})</p>
          </div>
          <div>
            <h2>Coming Weather</h2>
            {comingWeather}
          </div>
        </div>
       
      
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app')
);
