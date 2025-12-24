
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { Activity, Calculator, Menu, Home, Users, Box, FileText, Sun, Moon, Building, Wallet, ChevronRight, Settings } from 'lucide-react';

const navItemVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  }
};

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: <Home className="h-4 w-4" />
    },
    {
      path: '/transactions',
      label: 'Transactions',
      icon: <Activity className="h-4 w-4" />
    },
    {
      path: '/calculations',
      label: 'Calculations',
      icon: <Calculator className="h-4 w-4" />
    },
    {
      path: '/employees',
      label: 'Employees',
      icon: <Users className="h-4 w-4" />
    },
    {
      path: '/materials',
      label: 'Materials',
      icon: <Box className="h-4 w-4" />
    },
    {
      path: '/sites',
      label: 'Site Tracker',
      icon: <Building className="h-4 w-4" />
    },
    {
      path: '/salary',
      label: 'Salary Records',
      icon: <Wallet className="h-4 w-4" />
    },
    {
      path: '/docs',
      label: 'Documents',
      icon: <FileText className="h-4 w-4" />
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />
    }
  ];

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  const renderNavLinks = () => {
    return navItems.map(item => (
      <motion.div key={item.path} variants={navItemVariants} whileHover="hover" className="w-full">
        <Button
          variant={isActiveLink(item.path) ? "default" : "ghost"}
          asChild
          className={`w-full justify-start ${isActiveLink(item.path) ? "bg-primary text-primary-foreground relative after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-8 after:bg-primary-foreground after:rounded-l-md" : "hover:bg-accent hover:text-accent-foreground"}`}
          onClick={isMobile ? closeMobileMenu : undefined}
        >
          <Link to={item.path} className="flex items-center w-full">
            <span className="mr-2 flex items-center justify-center">{item.icon}</span>
            <span>{item.label}</span>
            {isActiveLink(item.path) && !isMobile && <ChevronRight className="ml-auto h-4 w-4 opacity-70" />}
          </Link>
        </Button>
      </motion.div>
    ));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="w-full px-3 sm:px-4 md:container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2 mr-2">
          <Link to="/" className="font-bold text-lg sm:text-xl flex items-center">
            <img 
              src="/lovable-uploads/e9592ba8-41f9-4a72-9de9-b581801a1755.png" 
              alt="Powerhouse Logo"
              className="h-7 w-7 sm:h-8 sm:w-8 mr-2"
            />
            <motion.span
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-base sm:text-lg truncate max-w-[180px] sm:max-w-none"
            >
              Powerhouse
            </motion.span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex items-center gap-1 mx-4 overflow-x-auto scrollbar-hide">
            {renderNavLinks()}
          </nav>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <div className="font-bold text-xl flex items-center mb-8">
                <img 
                  src="/lovable-uploads/e9592ba8-41f9-4a72-9de9-b581801a1755.png" 
                  alt="Powerhouse Logo"
                  className="h-6 w-6 mr-2"
                />
                Powerhouse
              </div>
              <nav className="flex flex-col gap-1">
                {renderNavLinks()}
              </nav>
            </SheetContent>
          </Sheet>
        )}

        {/* Action Buttons (Settings Link on mobile) */}
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/settings">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
