
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Progress } from '@/components/ui/progress';

const SplashScreen = () => {
  const [redirect, setRedirect] = useState(false);
  const [progress, setProgress] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Animation for progress bar
    const totalDuration = 5000; // 5 seconds
    const interval = 50; // Update every 50ms
    const step = (interval / totalDuration) * 100;
    
    const timer = setTimeout(() => {
      setRedirect(true);
    }, totalDuration);
    
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newValue = prev + step;
        return newValue > 100 ? 100 : newValue;
      });
    }, interval);
    
    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, []);

  if (redirect) {
    return <Navigate to="/" replace />;
  }

  const containerVariants = {
    initial: { 
      background: "linear-gradient(135deg, #03045E 0%, #0077B6 100%)" 
    },
    animate: { 
      background: "linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)",
      transition: { 
        duration: 5,
        ease: "easeInOut"
      }
    }
  };

  const logoVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.34, 1.56, 0.64, 1], // Custom spring-like bounce
      }
    }
  };

  const sparkleAnimation = {
    initial: { opacity: 0, scale: 0 },
    animate: { 
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: 2,
        repeatType: "loop" as const
      }
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 flex flex-col items-center justify-center z-50 overflow-hidden"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="relative">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div 
            className="relative inline-block"
            variants={logoVariants}
            initial="initial"
            animate="animate"
          >
            <motion.h1 
              className={`text-white font-bold mb-4 ${isMobile ? 'text-4xl' : 'text-6xl'}`}
            >
              Powerhouse Solutions
            </motion.h1>
            {/* Decorative sparkles */}
            <motion.div 
              className="absolute -top-4 -right-4 w-8 h-8 text-electric-gold"
              variants={sparkleAnimation}
              initial="initial"
              animate="animate"
            >
              ✨
            </motion.div>
            <motion.div 
              className="absolute -bottom-2 -left-4 w-8 h-8 text-electric-gold"
              variants={sparkleAnimation}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.5 }}
            >
              ✨
            </motion.div>
          </motion.div>
          
          <motion.p 
            className={`text-white/80 ${isMobile ? 'text-lg' : 'text-xl'} mb-8`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            Your daily electrician transaction & calculation tracker
          </motion.p>
          
          <motion.div
            className="w-full max-w-xs mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <Progress value={progress} className="h-2 bg-white/20" />
            <p className="text-white/60 text-sm mt-2">
              Loading... {Math.round(progress)}%
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
