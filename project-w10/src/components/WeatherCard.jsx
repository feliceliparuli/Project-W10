import { Card } from "react-bootstrap";

function SchedaMeteo({ dati }) {
  const icona = dati.weather[0].icon;
  const descrizione = dati.weather[0].description;

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title className="text text-center">
          <i className="bi bi-geo-alt-fill"></i> {dati.name}
        </Card.Title>
        <Card.Text className="text-center">
          <img
            src={`https://openweathermap.org/img/wn/${icona}@2x.png`}
            alt={descrizione}
          />
          <br />
          <strong className="text-capitalize">{descrizione}</strong>
          <br />
          <i className="bi bi-thermometer-half me-2"></i>
          {dati.main.temp}°C
          <br />
          <i className="bi bi-wind me-2"></i>
          {dati.wind.speed} m/s
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default SchedaMeteo;
