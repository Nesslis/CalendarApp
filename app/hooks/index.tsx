import React from 'react';

import { AppLocaleProvider } from './locale';

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return <AppLocaleProvider>{children}</AppLocaleProvider>;
};

export default AppProvider;
