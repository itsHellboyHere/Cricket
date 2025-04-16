
import { Suspense } from 'react';

import LoginOauth from '../components/LoginOauth';



export default function LoginPage() {
  return (
    <Suspense>
    <LoginOauth/>
    </Suspense>
   
  );
}