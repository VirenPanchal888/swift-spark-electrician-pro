
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { 
  Activity, 
  Calculator, 
  Menu, 
  Home, 
  Users, 
  Box, 
  FileText, 
  Sun, 
  Moon,
  Building 
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();
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

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
    { path: '/transactions', label: 'Transactions', icon: <Activity className="h-4 w-4" /> },
    { path: '/calculations', label: 'Calculations', icon: <Calculator className="h-4 w-4" /> },
    { path: '/employees', label: 'Employees', icon: <Users className="h-4 w-4" /> },
    { path: '/materials', label: 'Materials', icon: <Box className="h-4 w-4" /> },
    { path: '/sites', label: 'Site Tracker', icon: <Building className="h-4 w-4" /> },
    { path: '/docs', label: 'Documents', icon: <FileText className="h-4 w-4" /> },
  ];

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const renderNavLinks = () => {
    return navItems.map((item) => (
      <Button
        key={item.path}
        variant={isActiveLink(item.path) ? "default" : "ghost"}
        asChild
        className={isActiveLink(item.path) ? "bg-primary text-primary-foreground" : ""}
        onClick={isMobile ? closeMobileMenu : undefined}
      >
        <Link to={item.path}>
          {item.icon}
          <span className="ml-2">{item.label}</span>
        </Link>
      </Button>
    ));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2 mr-4">
          <Link to="/" className="font-bold text-xl flex items-center">
            <Activity className="h-5 w-5 mr-1 text-primary" />
            Powerhouse
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex items-center gap-2 mx-4">
            {renderNavLinks()}
          </nav>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <div className="font-bold text-xl flex items-center mb-8">
                <Activity className="h-5 w-5 mr-1 text-primary" />
                Powerhouse
              </div>
              <nav className="flex flex-col gap-2">
                {renderNavLinks()}
              </nav>
            </SheetContent>
          </Sheet>
        )}

        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={toggleTheme}>
              {theme === 'light' ? (
                <>
                  <Moon className="h-4 w-4 mr-2" />
                  Dark Mode
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4 mr-2" />
                  Light Mode
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
