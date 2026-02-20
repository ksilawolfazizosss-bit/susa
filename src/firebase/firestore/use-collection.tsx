'use client';

import { useEffect, useState } from 'react';
import { onSnapshot, Query } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useCollection<T>(query: Query | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setData(null);
      setLoading(false);
      return () => {}; // Return an empty cleanup function
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const data: T[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as T));
        setData(data);
        setLoading(false);
      },
      (err) => {
        console.error('Snapshot error:', err);
        const permissionError = new FirestorePermissionError({
          path: query.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setData(null); // Set data to null on error
        setLoading(false);
      }
    );

    // Unsubscribe from the listener when the component unmounts or query changes
    return () => unsubscribe();
  }, [query]); // Re-run effect if query object changes

  return { data, loading };
}
