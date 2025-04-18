'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setConsent } from '../store/actions/complianceActions';

export default function ConsentWorkflow() {
  const [isEnabled, setIsEnabled] = useState(false);
  const dispatch = useDispatch();

  const toggleSwitch = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    dispatch(setConsent(newValue));
  };

  return (
    <div className="flex items-center p-4">
      <p className="text-base text-foreground mr-4">
        I consent to outreach compliance (GDPR, LinkedIn ToS)
      </p>
      <input
        type="checkbox"
        checked={isEnabled}
        onChange={toggleSwitch}
        className="w-5 h-5 text-[#10B981] bg-background border-[#1E3A8A] rounded focus:ring-[#10B981]"
      />
    </div>
  );
}
