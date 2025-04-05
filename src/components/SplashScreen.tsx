
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const SplashScreen = () => {
  const [redirect, setRedirect] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => {
      setRedirect(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  if (redirect) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-electric z-50 overflow-hidden">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h1 
          className={`text-white font-bold mb-4 ${isMobile ? 'text-4xl' : 'text-6xl'}`}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 1.2, 
            ease: "easeOut",
            delay: 0.5
          }}
        >
          Powerhouse Solutions
        </motion.h1>
        <motion.p 
          className={`text-white/80 ${isMobile ? 'text-lg' : 'text-xl'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          Your daily electrician transaction & calculation tracker
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
