import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import { SignInForm } from '@/components/forms/sign-in';
import { setupStore } from '@/store';

const store = setupStore();

describe('SignInForm', () => {
  beforeAll(() => {
    process.env.PUBLIC_API_URL = 'https://mocked-api.com';
  });

  it('renders form in document', () => {
    render(
      <Provider store={store}>
        <SignInForm onFlip={() => true} />
      </Provider>,
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
});
