import { Link, useLocation } from 'react-router-dom';
import { Code2, FolderOpen, FolderCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code2 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Dev TODO SoftVergara
            </h1>
          </div>
          
          <div className="flex gap-2">
            <Link to="/">
              <button
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
                  location.pathname === "/" 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-secondary"
                )}
              >
                <FolderOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Proyectos Activos</span>
              </button>
            </Link>
            
            <Link to="/completed">
              <button
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
                  location.pathname === "/completed" 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-secondary"
                )}
              >
                <FolderCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Proyectos Completados</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
