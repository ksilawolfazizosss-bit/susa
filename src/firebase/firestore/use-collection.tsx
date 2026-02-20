'use client';

import { useEffect, useState, useMemo } from 'react';
import { onSnapshot, Query } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// A simple deep equality check for the query's path and filters.
// This is to avoid re-subscribing when the query object reference changes but the query itself is the same.
const areQueriesEqual = (q1: Query, q2: Query): boolean => {
    return (
        q1.path === q2.path &&
        JSON.stringify(q1._query.filters) === JSON.stringify(q2._query.filters)
    );
};

export function useCollection<T>(query: Query | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoize the query to prevent re-subscriptions on re-renders if the query hasn't changed.
  const memoizedQuery = useMemo(() => query, [query, areQueriesEqual(query, query)]);

  useEffect(() => {
    if (!memoizedQuery) {
      setData(null);
      setLoading(false);
      return () => {}; // Return an empty cleanup function
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      memoizedQuery,
      (snapshot) => {
        const data: T[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as T));
        setData(data);
        setLoading(false);
      },
      (err) => {
        const permissionError = new FirestorePermissionError({
          path: memoizedQuery.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setData(null); // Set data to null on error
        setLoading(false);
      }
    );

    // Unsubscribe from the listener when the component unmounts or query changes
    return () => unsubscribe();
  }, [memoizedQuery]);

  return { data, loading };
}
