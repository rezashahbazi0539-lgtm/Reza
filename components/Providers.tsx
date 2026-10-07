'use client';

import { StoreProvider } from './StoreContext';

export default function Providers({ children }) {
  return <StoreProvider>{children}</StoreProvider>;
}
