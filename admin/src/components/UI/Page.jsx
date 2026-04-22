import styled from 'styled-components';

export const Page = styled.div`
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: ${(props) => props.backgroundColor || '#F9FAFB'};
`;

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #111827;
  margin: 0;
`;

export const PageSubTitle = styled.p`
  color: #747d8a;
  margin-top: 0.5rem;
`;

export const PageHeader = styled.div``;
