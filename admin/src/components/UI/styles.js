import styled from 'styled-components';
import { Link } from 'react-router';

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    to bottom right,
    ${(props) => props.bgFrom || '#a855f7'},
    ${(props) => props.bgTo || '#ec4899'}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

export const LoginCardContainer = styled.div`
  width: 100%;
  max-width: 28rem;
`;

export const LoginCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 2rem;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 0.5rem;
`;

export const Subtitle = styled.p`
  color: #4b5563;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.gap || '1.25rem'};
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

export const InputContainer = styled.div``;

export const Input = styled.input`
  width: 100%;
  padding-left: 2.5rem;
  padding-right: 1rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${(props) => props.focusColor || '#a855f7'};
  }
`;

export const CheckboxContainer = styled.label`
  display: flex;
  align-items: flex-start;
`;

export const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  margin-top: 0.25rem;
  color: ${(props) => props.color || '#9333ea'};
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
`;

export const CheckboxLabel = styled.label`
  margin-left: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
`;

export const CheckboxText = styled.span`
  margin-left: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
`;

export const LinkStyled = styled.a`
  color: ${(props) => props.color || '#9333ea'};
  &:hover {
    color: ${(props) => props.hoverColor || '#7c3aed'};
  }
`;

export const Button = styled.button`
  width: 100%;
  background: ${(props) => props.bg || '#9333ea'};
  color: white;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
  &:hover {
    background: ${(props) => props.hoverBg || '#7c3aed'};
  }
`;

export const Footer = styled.div`
  margin-top: 1.5rem;
  text-align: center;
`;

export const FooterText = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
`;

export const FooterLink = styled(Link)`
  color: ${(props) => props.color || '#9333ea'};
  font-weight: 500;
  &:hover {
    color: ${(props) => props.hoverColor || '#7c3aed'};
  }
`;

export const Copyright = styled.p`
  text-align: center;
  color: white;
  font-size: 0.875rem;
  margin-top: 1.5rem;
`;
