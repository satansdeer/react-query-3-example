// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { createMemoryHistory } from 'history'
import { render } from "@testing-library/react"
import { Router } from "react-router-dom"

global.renderWithRouter = (renderComponent, route) => {
  const history = createMemoryHistory();

  if(route){
    history.push(route)
  }

  return {
    ...render(<Router history={history}>{renderComponent()}</Router>), history
  }
}