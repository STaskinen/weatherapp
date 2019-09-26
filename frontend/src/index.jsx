import React from 'react';
import ReactDOM from 'react-dom';

const baseURL = process.env.ENDPOINT;

const getWeatherFromApi = async () => {
  console.log('async');
  try {
    const response = await fetch(`${baseURL}/weather`);
    return response.json();
  } catch (error) {
    console.error(error);
  }

  return {};
};

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: "",
    };
  }

  async componentWillMount() {
    console.log('Component mount')
    const weather = await getWeatherFromApi();
    this.setState({icon: weather.icon.slice(0, -1), current: weather.main});
  }

  render() {
    const { icon, current } = this.state;
    return (
      <div className="icon">
        <h1>Current weather</h1>
        <h2>{current}</h2>
        { icon && <img src={`/img/${icon}.svg`} /> }
      </div>
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app')
);
