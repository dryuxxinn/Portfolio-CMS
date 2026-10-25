'use client';

import { useEffect, useState } from 'react';

export default function TypewriterRole({ roles = [] }) {
  const roleList = roles && roles.length > 0
    ? roles
    : ['Cyber Security Engineer', 'Network Engineer', 'System Administrator'];

  const [typedRole, setTypedRole] = useState(roleList[0] || '');
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(roleList[0]?.length || 0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roleList[roleIndex % roleList.length] || '';

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentRole.length) {
          setTypedRole(currentRole.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (charIndex > 0) {
          setTypedRole(currentRole.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setRoleIndex((prev) => prev + 1);
        }
      }
    }, isDeleting ? 40 : 90);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, roleIndex, roleList]);

  return (
    <h2 className="text-xl sm:text-2xl font-bold min-h-[36px] flex items-center">
      <span className="text-gradient-cyan">{typedRole}</span>
      <span className="ml-1 inline-block w-0.5 h-6 bg-[#00f2fe] animate-ping" />
    </h2>
  );
}

