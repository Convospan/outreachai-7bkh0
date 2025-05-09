"use client";
import { useSearchParams } from 'next/navigation';
import type React from 'react';

// It's good practice to define props if you expect any, even if not used in this simple example.
// interface ClientComponentProps {
//   // Define any props this component might receive
// }

export default function ClientComponent(/* props: ClientComponentProps */) {
  const searchParams = useSearchParams();
  const monospaceUid = searchParams.get('monospaceUid');
  
  return <div>Monospace UID: {monospaceUid}</div>;
}
