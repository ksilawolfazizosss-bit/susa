'use client';

import { useEffect, useState, useRef } from 'react';
import { onSnapshot, DocumentReference, DocumentData } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useDoc<T>(docRef: DocumentReference | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const docRefRef = useRef(docRef);

  useEffect(() => {
    if (docRef?.path !== docRefRef.current?.path) {
      docRefRef.current = docRef;
    }
  }, [docRef]);


  useEffect(() => {
    if (!docRefRef.current) {
      setData(null);
      setLoading(false);
      return;
    }
    
    setLoading(true);

    const unsubscribe = onSnapshot(
      docRefRef.current,
      (snapshot) => {
        if (snapshot.exists()) {
          const data: T = { id: snapshot.id, ...snapshot.data() } as T;
          setData(data);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      async (err) => {
        console.error("Snapshot error:", err);
        const permissionError = new FirestorePermissionError({
          path: docRefRef.current!.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docRefRef.current]);

  return { data, loading };
}
