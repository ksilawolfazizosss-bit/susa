'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

// This component is a workaround to allow throwing an error from an event
// emitter to be caught by Next.js's error boundary.
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: Error) => {
      // This will be caught by the Next.js error boundary.
      throw error;
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  return null; // This component doesn't render anything.
}
