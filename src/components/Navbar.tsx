import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Activity, Calculator, Menu, Home, Users, Box, FileText, Sun, Moon, Building, Wallet, ChevronRight } from 'lucide-react';
import { BackupControlPanel } from './sync/BackupControlPanel';
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
  const {
    toast
  } = useToast();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} Theme Activated`,
      description: `The application is now using the ${newTheme} theme.`
    });
  };
  const navItems = [{
    path: '/',
    label: 'Dashboard',
    icon: <Home className="h-4 w-4" />
  }, {
    path: '/transactions',
    label: 'Transactions',
    icon: <Activity className="h-4 w-4" />
  }, {
    path: '/calculations',
    label: 'Calculations',
    icon: <Calculator className="h-4 w-4" />
  }, {
    path: '/employees',
    label: 'Employees',
    icon: <Users className="h-4 w-4" />
  }, {
    path: '/materials',
    label: 'Materials',
    icon: <Box className="h-4 w-4" />
  }, {
    path: '/sites',
    label: 'Site Tracker',
    icon: <Building className="h-4 w-4" />
  }, {
    path: '/salary',
    label: 'Salary Records',
    icon: <Wallet className="h-4 w-4" />
  }, {
    path: '/docs',
    label: 'Documents',
    icon: <FileText className="h-4 w-4" />
  }];
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  const renderNavLinks = () => {
    return navItems.map(item => <motion.div key={item.path} variants={navItemVariants} whileHover="hover" className="w-full">
        <Button variant={isActiveLink(item.path) ? "default" : "ghost"} asChild className={`w-full justify-start ${isActiveLink(item.path) ? "bg-primary text-primary-foreground relative after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-8 after:bg-primary-foreground after:rounded-l-md" : "hover:bg-accent hover:text-accent-foreground"}`} onClick={isMobile ? closeMobileMenu : undefined}>
          <Link to={item.path} className="flex items-center w-full">
            <span className="mr-2 flex items-center justify-center">{item.icon}</span>
            <span>{item.label}</span>
            {isActiveLink(item.path) && !isMobile && <ChevronRight className="ml-auto h-4 w-4 opacity-70" />}
          </Link>
        </Button>
      </motion.div>);
  };
  return <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2 mr-4">
          <Link to="/" className="font-bold text-xl flex items-center">
            
            <motion.span initial={{
            opacity: 0,
            y: -5
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.3
          }} className="text-xl">👨🏻‍🔧Powerhouse</motion.span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && <nav className="flex items-center gap-1 mx-4 overflow-x-auto scrollbar-hide">
            {renderNavLinks()}
          </nav>}

        {/* Mobile Menu Button */}
        {isMobile && <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <div className="font-bold text-xl flex items-center mb-8">
                <Activity className="h-5 w-5 mr-1 text-primary" />
                Powerhouse
              </div>
              <nav className="flex flex-col gap-1">
                {renderNavLinks()}
              </nav>
              <div className="mt-auto pt-4 border-t">
                <Button variant="outline" onClick={toggleTheme} className="w-full justify-start">
                  {theme === 'light' ? <>
                      <Moon className="h-4 w-4 mr-2" />
                      Dark Mode
                    </> : <>
                      <Sun className="h-4 w-4 mr-2" />
                      Light Mode
                    </>}
                </Button>
              </div>
            </SheetContent>
          </Sheet>}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Backup Control Panel */}
          <BackupControlPanel />

          {/* Theme Toggle */}
          {!isMobile && <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative overflow-hidden">
                  <motion.div initial={{
                rotate: 0
              }} animate={{
                rotate: 360
              }} transition={{
                duration: 0.5,
                ease: "easeInOut"
              }} className="absolute inset-0 opacity-0 hover:opacity-10 bg-primary rounded-full" />
                  {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                  {theme === 'light' ? <>
                      <Moon className="h-4 w-4 mr-2" />
                      Dark Mode
                    </> : <>
                      <Sun className="h-4 w-4 mr-2" />
                      Light Mode
                    </>}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>}
        </div>
      </div>
    </header>;
};
export default Navbar;