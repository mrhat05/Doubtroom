import React, { useState, useEffect } from 'react';
import { Search, Instagram, Youtube, Linkedin, Menu, ChevronRight } from 'lucide-react';
import { NavLink,Link } from 'react-router-dom';
import Logo from '../assets/logoWhite.png';
import { motion } from 'framer-motion';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen
          ? 'bg-[#0a192f]/90 shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-8 py-4">
        <motion.div 
          className='flex gap-3 items-center'
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className={`w-10 h-10 rounded-xl ${
            isScrolled || isMenuOpen ? 'bg-teal-500/20' : 'bg-white/10'
          } flex items-center justify-center`}>
            <img src={Logo} alt="Logo" className="w-7 h-7" />
          </div>
          <div className={`text-2xl font-bold ${
            isScrolled || isMenuOpen ? 'text-teal-400' : 'text-white'
          } font-space`}>Doubtroom</div>
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          <Navitem link="/about" text="About" isScrolled={isScrolled} />
          <Navitem link="/login" text="Log in" isScrolled={isScrolled} />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/signup" className={`px-6 py-2.5 ${
              isScrolled 
                ? 'bg-teal-500 hover:bg-teal-600' 
                : 'bg-gradient-to-r from-teal-400 to-teal-500'
            } text-white rounded-lg font-medium font-space hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-200`}>
              Get Started
            </Link>
          </motion.div>
        </div>

        <motion.button 
          className={`md:hidden ${
            isScrolled ? 'text-teal-400' : 'text-white'
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Menu size={24} />
        </motion.button>
      </div>

      {/* Mobile menu */}
      <motion.div 
        initial={false}
        animate={{ 
          height: isMenuOpen ? 'auto' : 0,
          opacity: isMenuOpen ? 1 : 0
        }}
        className={`md:hidden overflow-hidden bg-[#0a192f]/90`}
      >
        <div className="py-4 space-y-4 px-2">
          <Navitem link="/about" text="About" isScrolled={true} />
          <Navitem link="/login" text="Log in" isScrolled={true} />
          <Navitem link="/signup" text="Sign up" isScrolled={true} />
        </div>
      </motion.div>
    </motion.nav>
  );
};

const Navitem = ({ text, link = "", isScrolled }) => {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <NavLink
        to={link}
        className={`text-base font-space transition-colors duration-200 ${
          isScrolled 
            ? 'text-teal-400/80 hover:text-teal-400' 
            : 'text-white/80 hover:text-white'
        }`}
      >
        {text}
      </NavLink>
    </motion.div>
  );
};

const SocialLink = ({ icon, username, platform }) => {
  return (
    <Link className="group">
      <div className="flex items-center space-x-3 sm:space-x-4 transition-all duration-300 hover:scale-105">
        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full border border-white/30 flex items-center justify-center text-white group-hover:border-teal-400 group-hover:bg-teal-400/10 group-hover:shadow-lg group-hover:shadow-teal-400/20 transition-all duration-300">
          <div className="group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>
        <div className="text-white">
          <p className="text-xs sm:text-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300">{platform}</p>
          <p className="font-medium text-xs sm:text-base group-hover:text-teal-400 transition-colors duration-300">{username}</p>
        </div>
      </div>
    </Link>
  )
}

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/20 py-4 bg-gradient-to-b from-transparent to-[#0a192f]/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-12">
            <SocialLink 
              icon={<Instagram size={18} className="sm:w-5 sm:h-5" />} 
              platform="Join US" 
              username="Instagram" 
            />
            <SocialLink 
              icon={<Youtube size={18} className="sm:w-5 sm:h-5" />} 
              platform="Build with us" 
              username="Youtube" 
            />
            <SocialLink 
              icon={<Linkedin size={18} className="sm:w-5 sm:h-5" />} 
              platform="Know us" 
              username="LinkedIN" 
            />
          </div>
        </div>
        <div className="mt-2 text-center">
          <div className="text-white/60 text-xs sm:text-sm">
            © 2024 Doubtroom. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

const HeroSection = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-12">
      <div className="absolute inset-0 bg-gradient-to-b from-teal-500/10 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 py-8">
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-space leading-tight">
                Welcome to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-500">
                  Doubtroom
                </span>
              </h1>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <div className="absolute -left-4 top-0 text-4xl text-teal-400/20">"</div>
                <p className="text-xl text-white/80 italic pl-4 border-l-2 border-teal-400/30">
                  The only bad question is the one never asked.
                </p>
                <p className="text-right text-white/60 mt-2">— Albert Einstein</p>
                <div className="absolute -right-4 bottom-0 text-4xl text-teal-400/20">"</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <p className="text-lg text-white/80">
                  We believe every doubt deserves an answer—no matter how small or "silly" it may seem. 
                  That's why Doubtroom lets you ask your questions anonymously, free from hesitation or embarrassment.
                </p>
                <div className="space-y-2">
                  <p className="text-lg text-white/90 font-medium">
                    You're not shouting into the void.
                  </p>
                  <p className="text-lg text-white/80">
                    You're asking your own classmates and professors—people who truly understand your context, 
                    syllabus, and pace.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Link to="/signup">
                  <motion.button 
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-xl font-medium font-space hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-200 flex items-center justify-center gap-2 group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-sm sm:text-base">Start Your Journey</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <Link to="/about">
                  <motion.button 
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium font-space hover:bg-white/20 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-sm sm:text-base">Learn More</span>
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="flex-1 relative flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
          >
            <div className="relative w-full max-w-[280px] sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-teal-500/30 to-blue-500/30 rounded-3xl blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.img 
                src="https://doubtroom.sirv.com/Doubtroom/art2.png"
                className="relative z-10 w-full h-auto object-contain"
                alt="Doubtroom Illustration"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <motion.h2 
              className="text-xl sm:text-2xl md:text-3xl font-bold mt-4 sm:mt-6 text-center max-w-[280px] sm:max-w-md md:max-w-2xl relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <div className="absolute -left-4 top-0 text-3xl sm:text-4xl text-teal-400/20">"</div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
                Ask Freely. Learn Boldly. Anonymously
              </span>
              <div className="absolute -right-4 bottom-0 text-3xl sm:text-4xl text-teal-400/20">"</div>
            </motion.h2>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const DoubtRoomPage = () => {
  return (
    <div className="min-h-screen bg-[#0a192f] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <NavBar />
      <HeroSection />
      <Footer/>
    </div>
  );
};

export default DoubtRoomPage;