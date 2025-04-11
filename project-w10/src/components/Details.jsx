import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Card, Button } from "react-bootstrap";

const apiKey = "aa6354ec4cfda784e7dcdf2964902721";

function Dettagli() {
  const { city } = useParams();
  const [meteo, setMeteo] = useState(null);
  const [previsioni, setPrevisioni] = useState([]);
  const [preferito, setPreferito] = useState(false);
  const [caricando, setCaricando] = useState(true);

  useEffect(() => {
    const salvati = JSON.parse(localStorage.getItem("preferiti")) || [];
    setPreferito(salvati.includes(city));

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=it`
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Errore nel caricamento dati");
        }
      })
      .then((data) => {
        setMeteo(data);
        return fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=it`
        );
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Errore nel caricamento dati");
        }
      })
      .then((data) => {
        const giorni = data.list.filter((_, i) => i % 8 === 0);
        setPrevisioni(giorni);
        setCaricando(false);
      })
      .catch(() => {
        alert("Errore nel caricamento");
        setCaricando(false);
      });
  }, [city]);

  const gestisciPreferiti = () => {
    const salvati = JSON.parse(localStorage.getItem("preferiti")) || [];
    if (preferito) {
      localStorage.setItem(
        "preferiti",
        JSON.stringify(salvati.filter((c) => c !== city))
      );
    } else {
      salvati.unshift(city);
      localStorage.setItem("preferiti", JSON.stringify(salvati.slice(0, 10)));
    }
    setPreferito(!preferito);
  };

  function formattaOra(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (caricando || !meteo) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  const tipo = meteo.weather[0].main;
  const icona = meteo.weather[0].icon;
  const descrizione = meteo.weather[0].description;
  const fusoOrarioSecondi = meteo.timezone;
  const utc = meteo.dt + meteo.timezone;
  const oraLocale = new Date(utc * 1000).toLocaleString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-vh-100  py-5">
      <Container>
        <Row className="text-center mb-5">
          <Col>
            <h1 className="display-4 fw-bold">{meteo.name}</h1>
            <p>{oraLocale}</p>
            <img
              src={`https://openweathermap.org/img/wn/${icona}@2x.png`}
              style={{ width: "60px" }}
            />
            <h2>{meteo.main.temp}°C</h2>
            <p className="lead text-capitalize">{descrizione}</p>

            <p>
              <strong>Min:</strong> {meteo.main.temp_min}° /
              <strong> Max:</strong> {meteo.main.temp_max}°
            </p>

            <ul className="d-flex flex-column flex-lg-row list-unstyled justify-content-between">
              <li>
                <i className="bi bi-droplet-fill me-2"></i> Umidità:{" "}
                {meteo.main.humidity}%
              </li>
              <li>
                <i className="bi bi-graph-up me-2"></i> Pressione:{" "}
                {meteo.main.pressure} hPa
              </li>
              <li>
                <i className="bi bi-wind me-2"></i> Vento: {meteo.wind.speed}{" "}
                m/s
              </li>
              <li>
                <i className="bi bi-cloud-fill me-2"></i> Nuvolosità:{" "}
                {meteo.clouds.all}%
              </li>
              <li>
                {" "}
                <i className="bi bi-sunrise me-2"></i> Alba:{" "}
                {formattaOra(meteo.sys.sunrise)}
              </li>
              <li>
                {" "}
                <i className="bi bi-sunset me-2"></i> Tramonto:{" "}
                {formattaOra(meteo.sys.sunset)}
              </li>
              <li>
                <i className="bi bi-geo-alt-fill me-2"></i> Lat:{" "}
                {meteo.coord.lat}, Lon: {meteo.coord.lon}
              </li>
            </ul>

            <Button
              variant={preferito ? "success" : "outline-success"}
              onClick={gestisciPreferiti}
            >
              <i className={`bi ${preferito ? "bi-star-fill" : "bi-star"}`}></i>{" "}
              {preferito ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
            </Button>
          </Col>
        </Row>

        <Row className="g-3 justify-content-center">
          {previsioni.map((giorno, i) => (
            <Col xs={6} sm={4} md={2} key={i}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title style={{ fontSize: "1rem" }}>
                    {new Date(giorno.dt * 1000).toLocaleDateString("it-IT", {
                      weekday: "short",
                    })}
                  </Card.Title>
                  <img
                    src={`https://openweathermap.org/img/wn/${giorno.weather[0].icon}@2x.png`}
                    alt={giorno.weather[0].description}
                    style={{ width: "40px" }}
                  />
                  <p className="m-0">
                    {" "}
                    min {giorno.main.temp_min}°C / max {giorno.main.temp_max}°C
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Dettagli;
