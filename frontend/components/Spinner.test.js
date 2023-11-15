// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import Spinner from "./Spinner"
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

test('spinner text not displaying when spinner is not on', () => {
  //expect(true).toBe(true);
   render(<Spinner on={false}/>);
   const spinnerText = screen.queryByText(/please wait/i);
   expect(spinnerText).not.toBeInTheDocument();
})

test('spinner text  displaying when spinner is on', () => {
  //expect(true).toBe(true);
   render(<Spinner on={true}/>);
   const spinnerText = screen.queryByText(/please wait/i);
   expect(spinnerText).toBeInTheDocument();
})