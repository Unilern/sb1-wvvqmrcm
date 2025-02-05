// App.js
import React from "react";
import styled from "styled-components";
import { ThemeContextProvider } from "./ThemeContext";
import ThemeToggle from "./ThemeToggle";
import Chat from "./Chat";
import IDE from "./IDE";
import Operations from "./Operations";

const App = () => {
  return (
    <ThemeContextProvider>
      <Container>
        <Header>
          <Title>AI Assistant App</Title>
          <ThemeToggle />
        </Header>
        <Content>
          <Chat />
          <IDE />
          <Operations />
        </Content>
      </Container>
    </ThemeContextProvider>
  );
};

const Container = styled.div`
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  padding: 20px;
  text-align: center;
  background-color: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.buttonText};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

export default App;