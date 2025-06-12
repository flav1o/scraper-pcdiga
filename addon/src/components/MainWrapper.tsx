import styled from "styled-components";
import bg from "../assets/background-dark.png";

type MainWrapperProps = {
  width?: string;
  height?: string;
};

const MainWrapper = styled.main<MainWrapperProps>`
  width: ${({ width }) => width ?? "300px"};
  height: ${({ height }) => height ?? "400px"};
  margin: auto;
  outline: 1px solid red;
  background-color: white;
  display: flex;
  flex-direction: column;
  background-image: url(${bg});
  background-size: cover;
  overflow: hidden;
  transition-duration: 0.5s;
`;

export { MainWrapper };
