'use client';

import { useEffect } from 'react';
import { fetchAPI } from '@/lib/api';

export default function VisitorTracker({ page = '/' }) {
  useEffect(() => {
    fetchAPI('/visitors/hit', {
      method: 'POST',
      body: JSON.stringify({ page })
    });
  }, [page]);

  return null;
}

