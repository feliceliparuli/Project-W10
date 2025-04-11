import { InputGroup, FormControl, Button } from "react-bootstrap";

function BarraRicerca({ valore, cambiaValore, avviaRicerca }) {
  return (
    <InputGroup className="mb-3">
      <FormControl
        placeholder="Inserisci una città"
        value={valore}
        onChange={(e) => cambiaValore(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && avviaRicerca()}
      />
      <Button variant="primary" onClick={avviaRicerca}>
        <i className="bi bi-search"></i> Cerca
      </Button>
    </InputGroup>
  );
}

export default BarraRicerca;