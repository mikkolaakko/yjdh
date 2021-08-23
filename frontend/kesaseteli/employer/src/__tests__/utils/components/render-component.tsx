import AxiosTestContext from 'kesaseteli/employer/__tests__/utils/backend/axios-test-context';
import { NextRouter } from 'next/router';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import getDefaultReactQueryTestClient from 'shared/__tests__/utils/react-query/get-default-react-query-test-client';
import { render, RenderResult } from 'shared/__tests__/utils/test-utils';
import BackendAPIContext from 'shared/backend-api/BackendAPIContext';

const renderComponent = (
  Component: JSX.Element,
  client: QueryClient = getDefaultReactQueryTestClient(),
  router: Partial<NextRouter> = {}
): RenderResult =>
  render(
    <BackendAPIContext.Provider value={AxiosTestContext}>
      <QueryClientProvider client={client}>{Component}</QueryClientProvider>
    </BackendAPIContext.Provider>,
    router
  );

export default renderComponent;
