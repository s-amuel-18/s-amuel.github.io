import React, { useEffect, useState, useRef } from 'react';
import { useInView, useSpring, useTransform } from 'framer-motion';

interface Props {
  value: number;
  suffix?: string;
}

export const Counter: React.FC<Props> = ({ value, suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const count = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (isInView) {
      count.set(value);
    }
  }, [isInView, value, count]);

  const displayCount = useTransform(count, (latest) => Math.floor(latest));
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    return displayCount.on('change', (latest) => setCurrent(latest));
  }, [displayCount]);

  return (
    <span ref={ref} className="tabular-nums">
      {current}
      {suffix}
    </span>
  );
};
