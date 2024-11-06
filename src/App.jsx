import { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import axios from 'axios';
import {
	thunderstormSvg,
	drizzleSvg,
	rainSvg,
	snowSvg,
	atmosphereSvg,
	clearSvg,
	cloudSvg,
} from './assets/images';
import Card from './components/Card';

const key = '0162c001bb4a7a9d5d81bfcdad0ff68a';
const url = 'https://api.openweathermap.org/data/2.5/weather';

const conditionCodes = {
	thunderstorm: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
	drizzle: [300, 301, 302, 310, 311, 312, 313, 314, 321],
	rain: [500, 501, 502, 503, 504, 511, 520, 521, 522, 531],
	snow: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],
	atmosphere: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
	clear: [800],
	clouds: [801, 802, 803, 804],
};

const icons = {
	thunderstorm: thunderstormSvg,
	drizzle: drizzleSvg,
	rain: rainSvg,
	snow: snowSvg,
	atmosphere: atmosphereSvg,
	clear: clearSvg,
	clouds: cloudSvg,
};

function App() {
	const [coords, setCoords] = useState(null);
	const [weather, setWeather] = useState({});
	const [toggle, setToggle] = useState(false);
	const [locationDenied, setLocationDenied] = useState(false);
	const [city, setCity] = useState('');

	const handleCitySearch = () => {
		if (city.trim() === '') return;

		axios
			.get(`${url}?q=${city}&appid=${key}`)
			.then((res) => {
				const iconName = Object.keys(conditionCodes).find((key) =>
					conditionCodes[key].includes(res.data?.weather[0]?.id),
				);

				setWeather({
					city: res.data?.name,
					country: res.data?.sys?.country,
					icon: icons[iconName],
					main: res.data?.weather[0]?.main,
					wind: res.data?.wind?.speed,
					clouds: res.data?.clouds?.all,
					pressure: res.data?.main?.pressure,
					temperature: parseInt(res.data?.main?.temp - 273.15),
				});
				setLocationDenied(false);
			})
			.catch(() => {
				setWeather({
					error: 'No se pudo obtener los datos del clima para esa ciudad.',
				});
			});
	};

	const requestLocation = () => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				setCoords({ latitude, longitude });
				setLocationDenied(false);
			},
			() => {
				setCoords({ latitude: 19.4326, longitude: -99.1332 });
				setLocationDenied(true);
			},
		);
	};

	useEffect(() => {
		requestLocation();
	}, []);

	useEffect(() => {
		if (coords) {
			axios
				.get(
					`${url}?lat=${coords.latitude}&lon=${coords.longitude}&appid=${key}`,
				)
				.then((res) => {
					const iconName = Object.keys(conditionCodes).find((key) =>
						conditionCodes[key].includes(res.data?.weather[0]?.id),
					);

					setWeather({
						city: res.data?.name,
						country: res.data?.sys?.country,
						icon: icons[iconName],
						main: res.data?.weather[0]?.main,
						wind: res.data?.wind?.speed,
						clouds: res.data?.clouds?.all,
						pressure: res.data?.main?.pressure,
						temperature: parseInt(res.data?.main?.temp - 273.15),
					});
				})
				.catch(() => {
					setWeather({ error: 'No se pudo obtener los datos del clima.' });
				});
		}
	}, [coords]);

	const temperature = toggle
		? Math.round((weather.temperature * 9) / 5 + 32)
		: weather.temperature;
	const unit = toggle ? '°F' : '°C';

	const getBackgroundImage = () => {
		switch (weather.main) {
			case 'Snow':
				return "url('./snow.jpg')";
			case 'Rain':
				return "url('./rain.jpg')";
			case 'Clear':
				return "url('./clear.jpg')";
			case 'Thunderstorm':
				return "url('./thunderstorm.jpg')";
			case 'Clouds':
				return "url('./clouds.jpg')";
			case 'Drizzle':
				return "url('./drizzle.jpg')";
			default:
				return "url('./bg2.jpg')";
		}
	};

	const backgroundStyle = {
		backgroundImage: getBackgroundImage(),
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		minHeight: '100vh',
		display: 'grid',
		justifyContent: 'center',
		alignItems: 'center',
	};

	return (
		<div style={backgroundStyle}>
			<div className="search-container">
				<input
					type="text"
					placeholder="Buscar ciudad..."
					value={city}
					onChange={(e) => setCity(e.target.value)}
					className="search-input"
				/>
				<button onClick={handleCitySearch} className="search-button">
					Buscar
				</button>
			</div>

			<Card
				weather={weather}
				temperature={temperature}
				unit={unit}
				toggle={toggle}
				setToggle={() => setToggle(!toggle)}
			/>
		</div>
	);
}

export default App;
