import React from "react";
import styled from "styled-components";

interface ButtonProps {
  text: string;
  className?: string; // optional, in case you want to use the default style
}

const Button: React.FC<ButtonProps> = ({ text, className }) => {
  return (
    <StyledWrapper>
      <button
        id="bottone1"
        className={`font-inter font-medium text-white bg-gradient-to-r from-indigo-300 to-indigo-600 hover:scale-105 transition-transform duration-200 ${className || ""}`}
      >
        {text}
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  #bottone1 {
    padding-left: 28px;
    padding-right: 28px;
    padding-bottom: 10px;
    padding-top: 10px;
    border-radius: 10px;

    border: none;
    font-family: inherit;
    text-align: center;
    cursor: pointer;
    transition: 0.4s;
  }

  #bottone1:hover {
    box-shadow: 7px 5px 56px -14px #b09af3;
  }

  #bottone1:active {
    transform: scale(0.97);
    box-shadow: 7px 5px 56px -10px #b09af3;
  }
`;

export default Button;
// background: #7e5edd;
