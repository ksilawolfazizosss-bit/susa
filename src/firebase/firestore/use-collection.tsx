'use client';

import { useEffect, useState, useRef } from 'react';
import { onSnapshot, Query, DocumentData, collection, getDocs } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useCollection<T>(query: Query | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const queryRef = useRef(query);

  useEffect(() => {
    if (query?.path !== queryRef.current?.path) {
      queryRef.current = query;
    }
  }, [query]);

  useEffect(() => {
    if (!queryRef.current) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      queryRef.current,
      (snapshot) => {
        const data: T[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as T));
        setData(data);
        setLoading(false);
      },
      async (err) => {
        console.error("Snapshot error:", err);
        const permissionError = new FirestorePermissionError({
          path: queryRef.current!.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [queryRef.current]);

  return { data, loading };
}
