// ThemeToggle.js
import React from "react";
import { useTheme } from "./ThemeContext";
import styled from "styled-components";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme}>
      Switch to {isDark ? "Light" : "Dark"} Mode
    </Button>
  );
};

const Button = styled.button`
  background-color: ${(props) => props.theme.buttonBackground};
  color: ${(props) => props.theme.buttonText};
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    opacity: 0.8;
  }
`;

export default ThemeToggle;