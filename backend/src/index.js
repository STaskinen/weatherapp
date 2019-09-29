const debug = require('debug')('weathermap');

const Koa = require('koa');
const router = require('koa-router')();
const fetch = require('node-fetch');
const cors = require('kcors');

const appId = process.env.APPID || '8929c3a72ebd9c43135a6ee900f9dfc6';
const mapURI = process.env.MAP_ENDPOINT || "http://api.openweathermap.org/data/2.5";
const targetCity = process.env.TARGET_CITY || "Helsinki,fi";

const port = process.env.PORT || 9000;

const app = new Koa();

app.use(cors());

const fetchWeather = async (position) => {
  // const endpoint = `${mapURI}/weather?q=${targetCity}&appid=${appId}&`;
  const endpoint = `${mapURI}/forecast?lat=${position.lat}&lon=${position.lon}&cnt=5&appid=${appId}`;
    console.log(endpoint);
  const response = await fetch(endpoint);
  return response ? response.json() : {};
};

router.get('/api/weather', async ctx => {
  // if (ctx.querystring) {
    const position = { lat: ctx.query.lat, lon: ctx.query.lon, };
  // }
  const weatherData = await fetchWeather(position);
  ctx.type = 'application/json; charset=utf-8';
  ctx.body = weatherData.list ? weatherData.list : {};
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port);

console.log(`App listening on port ${port}`);
