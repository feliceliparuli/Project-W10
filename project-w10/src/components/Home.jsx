import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import BarraRicerca from "./SearchBar";
import SchedaMeteo from "./WeatherCard";
import {
  Container,
  Row,
  Col,
  Button,
  ListGroup,
  Card,
  Spinner,
} from "react-bootstrap";

const apiKey = "aa6354ec4cfda784e7dcdf2964902721";

function Home() {
  const [citta, setCitta] = useState("");
  const [meteo, setMeteo] = useState(null);
  const [meteoPrincipali, setMeteoPrincipali] = useState({});
  const [ricerche, setRicerche] = useState(
    JSON.parse(localStorage.getItem("ricerche")) || []
  );
  const naviga = useNavigate();

  const cittaPrincipali = [
    "Roma",
    "Milano",
    "Napoli",
    "Torino",
    "Palermo",
    "Venezia",
  ];

  const salvaRicerca = (nome) => {
    const aggiornata = [nome, ...ricerche.filter((i) => i !== nome)].slice(
      0,
      5
    );
    localStorage.setItem("ricerche", JSON.stringify(aggiornata));
    setRicerche(aggiornata);
  };

  const cancellaRicerca = (nome) => {
    const aggiornate = ricerche.filter((i) => i !== nome);
    localStorage.setItem("ricerche", JSON.stringify(aggiornate));
    setRicerche(aggiornate);
  };

  const cercaMeteo = () => {
    if (!citta) return;

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${citta}&appid=${apiKey}&units=metric&lang=it`
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Errore nel caricamento dati");
        }
      })
      .then((dati) => {
        setMeteo(dati);
        salvaRicerca(dati.name);
      })
      .catch(() => alert("Città non trovata"));
  };

  const meteoConPosizione = () => {
    if (!navigator.geolocation) {
      alert("Geolocalizzazione non supportata");
      return;
    }

    navigator.geolocation.getCurrentPosition((posizione) => {
      const { latitude, longitude } = posizione.coords;

      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=it`
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Errore nel caricamento dati");
          }
        })
        .then((dati) => {
          setMeteo(dati);
          salvaRicerca(dati.name);
        })
        .catch(() => alert("Errore con la posizione"));
    });
  };

  useEffect(() => {
    cittaPrincipali.forEach((nome) => {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${nome}&appid=${apiKey}&units=metric&lang=it`
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Errore nel caricamento dati");
          }
        })
        .then((data) => {
          setMeteoPrincipali((prec) => ({ ...prec, [nome]: data }));
        })
        .catch(() => {
          console.error(`Errore nel caricamento meteo per ${nome}`);
        });
    });
  }, []);

  return (
    <Container fluid className="min-vh-100 py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <BarraRicerca
            valore={citta}
            cambiaValore={setCitta}
            avviaRicerca={cercaMeteo}
          />

          <div className="text-center mt-2">
            <Button
              variant="success"
              className="btn-round"
              onClick={meteoConPosizione}
            >
              <i className="bi bi-geo-alt-fill me-2"></i> Posizione attuale
            </Button>
          </div>

          {meteo && (
            <>
              <div className="mt-4">
                <SchedaMeteo dati={meteo} />
                <div className="text-center mt-3">
                  <Button
                    variant="outline-primary"
                    onClick={() => naviga(`/dettagli/${meteo.name}`)}
                  >
                    <i className="bi bi-info-circle"></i> Dettagli
                  </Button>
                </div>
              </div>
              <hr className="my-5" />
            </>
          )}

          <h5 className="mb-3">Città italiane più cercate</h5>
          <Row className="g-3">
            {cittaPrincipali.map((nome) => (
              <Col xs={6} sm={4} md={2} key={nome}>
                <Card
                  onClick={() => naviga(`/dettagli/${nome}`)}
                  className="text-center shadow-sm h-100"
                  style={{ cursor: "pointer", minHeight: "170px" }}
                >
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                    <Card.Title style={{ fontSize: "1rem" }}>{nome}</Card.Title>
                    {meteoPrincipali[nome] ? (
                      <>
                        <img
                          src={`https://openweathermap.org/img/wn/${meteoPrincipali[nome].weather[0].icon}@2x.png`}
                          alt={meteoPrincipali[nome].weather[0].description}
                          style={{ width: "50px", height: "50px" }}
                        />
                        <p className="m-0">
                          {meteoPrincipali[nome].main.temp}°C
                          <br />
                          <small>
                            min {meteoPrincipali[nome].main.temp_min}°C / max{" "}
                            {meteoPrincipali[nome].main.temp_max}°C
                          </small>
                        </p>
                      </>
                    ) : (
                      <Spinner size="sm" animation="border" />
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {ricerche.length > 0 && (
            <div className="mt-5">
              <h5>Ricerche recenti</h5>
              <ListGroup>
                {ricerche.map((nome, i) => (
                  <ListGroup.Item
                    key={i}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <Link
                      to={`/dettagli/${nome}`}
                      className="text-decoration-none text-dark flex-grow-1"
                    >
                      <i className="bi bi-clock-history me-2"></i> {nome}
                    </Link>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => cancellaRicerca(nome)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
