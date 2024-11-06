import '../index.css';
import '../App.css';

import React from 'react';

function Card({ weather, temperature, unit, toggle, setToggle }) {
	return (
		<div className="card">
			<h1 className="card__title">Aplicación del Clima</h1>
			{weather.city && weather.country ? (
				<h2 className="card__subtitle">
					{weather.city}, {weather.country}
				</h2>
			) : (
				<div className="loading">
					<div className="loading__circle"></div>
				</div>
			)}

			<div className="card__body">
				<div className="card__info">
					<div className="card__container-icon-text">
						{weather.icon && (
							<div className="card__weather-icon-container">
								<img
									src={weather.icon}
									alt="weather icon"
									className="card__weather-icon"
								/>
							</div>
						)}

						<div className="card__data">
							<h3 className="card__main">"{weather.main}"</h3>
							<p className="card__wind-speed">
								<span className="label">Velocidad del Viento</span>{' '}
								<span className="value">{weather.wind} m/s</span>
							</p>
							<p className="card__clouds">
								<span className="label">Nubosidad</span>{' '}
								<span className="value">{weather.clouds}%</span>
							</p>
							<p className="card__pressure">
								<span className="label">Presión</span>{' '}
								<span className="value">{weather.pressure} Pa</span>
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className="card__temperature-container">
				<h2 className="card__temperature">
					{temperature !== undefined ? temperature.toFixed(0) : ''}
					{unit}
				</h2>
			</div>
			<div className="card__button-container">
				<button className="btn" onClick={() => setToggle(!toggle)}>
					Cambiar a {!toggle ? '°F' : '°C'}
				</button>
			</div>
			{weather.error ? (
				<p className="card__error-message">{weather.error}</p>
			) : (
				<span></span>
			)}
		</div>
	);
}

export default Card;
