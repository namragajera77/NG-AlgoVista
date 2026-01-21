import React from 'react';

import { motion } from 'framer-motion';

const VisualizationBars = ({ data, comparingIndices, swappedIndices, foundIndex, searchValue }) => {
  const maxValue = Math.max(...data);
  // On mobile, allow horizontal scroll if too many bars
  return (
    <div className="relative h-[220px] sm:h-[300px] md:h-[350px] flex items-end justify-center gap-0.5 sm:gap-1 p-2 sm:p-4 bg-white rounded-xl shadow-lg overflow-x-auto w-full">
      {/* Modern grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:16px_16px]" />
      <div className="relative flex items-end justify-center gap-0.5 sm:gap-1 w-full h-full z-10 min-w-[320px]">
        {data.map((value, index) => {
          const height = (value / maxValue) * 100;
          const isComparing = comparingIndices.includes(index);
          const isSwapped = swappedIndices.includes(index);
          const isFound = foundIndex === index;
          const isTarget = value === searchValue;

          let barColor = 'from-indigo-400 to-indigo-600';
          if (isComparing) barColor = 'from-amber-400 to-amber-600';
          else if (isSwapped) barColor = 'from-emerald-400 to-emerald-600';
          else if (isFound) barColor = 'from-sky-400 to-sky-600';
          else if (isTarget) barColor = 'from-violet-400 to-violet-600';

          // Responsive bar width: min 16px, max 32px, fill available space
          const barWidth = Math.max(Math.min(100 / data.length, 16), 8);

          return (
            <motion.div
              key={`${index}-${value}`}
              className="relative group"
              initial={{ height: 0 }}
              animate={{ 
                height: `${height}%`,
                transition: { type: "spring", stiffness: 400, damping: 25 }
              }}
              style={{ minWidth: '16px', maxWidth: '32px', width: `${barWidth}%` }}
            >
              {/* Value label - responsive sizing */}
              <motion.div
                className={`absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 px-1 sm:px-1.5 py-0.5 
                  rounded text-[10px] sm:text-xs font-medium bg-white shadow-sm z-20
                  ${isComparing ? 'text-amber-600' :
                    isSwapped ? 'text-emerald-600' :
                    isFound ? 'text-sky-600' :
                    isTarget ? 'text-violet-600' : 'text-indigo-600'}`}
              >
                {value}
              </motion.div>
              {/* Bar */}
              <motion.div
                className={`h-full w-full rounded-t-md bg-gradient-to-b ${barColor} 
                  relative overflow-hidden transition-all duration-200 group-hover:brightness-110`}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-t ${barColor}`} />
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                {/* Animated glow on active states */}
                {(isComparing || isSwapped || isFound || isTarget) && (
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.div>
              {/* Index indicator - responsive sizing */}
              <motion.div
                className={`absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 
                  text-[8px] sm:text-[10px] font-medium
                  ${isComparing ? 'text-amber-600' :
                    isSwapped ? 'text-emerald-600' :
                    isFound ? 'text-sky-600' :
                    isTarget ? 'text-violet-600' : 'text-gray-400'}`}
              >
                {index}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default VisualizationBars; 