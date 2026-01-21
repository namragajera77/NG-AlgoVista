import React from 'react';
import { motion } from "framer-motion";
import { staggerContainer, cardVariants } from "../../constants/index";

const AlgorithmInfo = ({ algorithm, algorithmInfo }) => {
  return (
    <motion.footer 
      className="mt-8 sm:mt-16 mb-4 sm:mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Code Section */}
        <motion.div
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 sm:p-6 shadow-lg lg:col-span-2"
          variants={cardVariants}
          whileHover="hover"
        >
          <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Algorithm Code</h3>
          <pre className="bg-gray-700 p-3 sm:p-4 rounded overflow-x-auto">
            <code className="text-green-400 font-mono text-xs sm:text-sm whitespace-pre-wrap">
              {algorithmInfo?.code || 'Select an algorithm'}
            </code>
          </pre>
        </motion.div>

        {/* Time Complexity Section */}
        <motion.div
          className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg p-4 sm:p-6 shadow-lg"
          variants={cardVariants}
          whileHover="hover"
        >
          <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Time Complexity</h3>
          <div className="space-y-3 sm:space-y-4 text-white">
            <p className="flex justify-between items-center">
              <span className="font-semibold text-sm sm:text-base">Best Case:</span>
              <span className="font-mono text-base sm:text-lg">{algorithmInfo?.timeComplexity.best || '-'}</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="font-semibold text-sm sm:text-base">Average Case:</span>
              <span className="font-mono text-base sm:text-lg">{algorithmInfo?.timeComplexity.average || '-'}</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="font-semibold text-sm sm:text-base">Worst Case:</span>
              <span className="font-mono text-base sm:text-lg">{algorithmInfo?.timeComplexity.worst || '-'}</span>
            </p>
          </div>
        </motion.div>

        {/* Space Complexity Section */}
        <motion.div
          className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-lg p-4 sm:p-6 shadow-lg lg:col-span-3"
          variants={cardVariants}
          whileHover="hover"
        >
          <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Space Complexity</h3>
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-2xl sm:text-4xl font-mono text-white mb-2">
              {algorithmInfo?.spaceComplexity || '-'}
            </p>
            <p className="text-white text-center mt-2 text-sm sm:text-base">
              Additional space required by the algorithm
            </p>
          </div>
        </motion.div>
      </motion.div>
    </motion.footer>
  );
};

export default AlgorithmInfo; 