import { useState } from "react";
import styled from "styled-components";
import ClientCard from "./ClientCard";

const Screen = styled.div`
  height: 100vh;
  background: #f5f5f5;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Box = styled.div`
  width: 100%;
  max-width: 360px;

  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Logo = styled.img`
  width: 80px;
  margin: 0 auto;
`;

const Title = styled.p`
  text-align: center;
  margin: 10px 0;
`;

const InfoWrap = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  gap: 8px;
`;

const InfoBtn = styled.div`
  background: red;
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Tooltip = styled.div`
  position: absolute;
  top: 25px;
  background: black;
  color: white;
  padding: 8px;
  font-size: 12px;
  border-radius: 6px;
`;

const Calendar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
`;

const Day = styled.div`
  padding: 12px 0;
  text-align: center;
  border-radius: 8px;
  background: ${(p) => (p.sel ? "#e50914" : "#e0e0e0")};
  color: ${(p) => (p.sel ? "white" : "#333")};
  font-weight: 500;
`;

const Times = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Col = styled.div`
  flex:1;
`;

const Time = styled.div`
  padding: 10px;
  background: ${(p)=>p.sel?"red":"#ddd"};
  margin-bottom: 5px;
  text-align:center;
`;

function Booking(){
  const [day,setDay]=useState(null);
  const [time,setTime]=useState(null);
  const [show,setShow]=useState(false);
  const [info,setInfo]=useState(false);

  const days=[...Array(30)].map((_,i)=>i+1);
  const m=["09:00","10:00","11:00"];
  const t=["15:00","16:00","17:00"];

  const selectTime=(tm)=>{
    setTime(tm);
    if(day) setShow(true);
  };

  return(
    <Screen>
      <Box>

        <Logo src="./logo.png"/>

        <InfoWrap>
          <Title>Seleccioná tu horario para la cita</Title>
          <InfoBtn onClick={()=>setInfo(!info)}>?</InfoBtn>
          {info && <Tooltip>Info del turno y condiciones</Tooltip>}
        </InfoWrap>

        <Calendar>
          {days.map(d=>(
            <Day key={d} sel={day===d} onClick={()=>setDay(d)}>
              {d}
            </Day>
          ))}
        </Calendar>

        <Times>
          <Col>
            {m.map(x=>(
              <Time key={x} sel={time===x} onClick={()=>selectTime(x)}>
                {x}
              </Time>
            ))}
          </Col>
          <Col>
            {t.map(x=>(
              <Time key={x} sel={time===x} onClick={()=>selectTime(x)}>
                {x}
              </Time>
            ))}
          </Col>
        </Times>

      </Box>

      {show && (
        <ClientCard
          date={day}
          time={time}
          onClose={()=>setShow(false)}
        />
      )}
    </Screen>
  );
}

export default Booking;