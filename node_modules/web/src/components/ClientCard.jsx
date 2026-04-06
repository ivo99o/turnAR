import { useState } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
`;

const Card = styled.div`
  background: white;
  width: 90%;
  max-width: 380px;
  border-radius: 16px;
  padding: 24px;

  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: white;
  color: black;
`;

const Buttons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Btn = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: none;

  background: ${(p) =>
    p.primary ? (p.disabled ? "#f28b8b" : "#e50914") : "#ddd"};

  color: ${(p) => (p.primary ? "white" : "black")};

  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
`;

function ClientCard({ date, time, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [done, setDone] = useState(false);

  const valid = form.name && form.email && form.phone;

  const submit = () => {
    if (!valid) return;
    setDone(true);
  };

  return (
    <Overlay>
      <Card>
        {!done ? (
          <>
            <h3>{date} - {time}</h3>

            <Input placeholder="Nombre completo"
              onChange={(e)=>setForm({...form,name:e.target.value})}/>

            <Input placeholder="Email"
              onChange={(e)=>setForm({...form,email:e.target.value})}/>

            <Input placeholder="Teléfono"
              onChange={(e)=>setForm({...form,phone:e.target.value})}/>

            <Buttons>
              <Btn onClick={onClose}>Cancelar</Btn>
              <Btn primary disabled={!valid} onClick={submit}>
                Confirmar
              </Btn>
            </Buttons>
          </>
        ) : (
          <>
            <h2>✅ Turno confirmado</h2>
            <Btn primary onClick={onClose}>Cerrar</Btn>
          </>
        )}
      </Card>
    </Overlay>
  );
}

export default ClientCard;