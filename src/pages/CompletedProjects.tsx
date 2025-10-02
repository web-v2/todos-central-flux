import { useState, useEffect } from 'react';
import { Project } from '@/types/project';
import { getProjects, updateProject, deleteProject } from '@/lib/storage';
import ProjectCard from '@/components/ProjectCard';
import ProjectDetail from '@/components/ProjectDetail';
import Navigation from '@/components/Navigation';
import { Input } from '@/components/ui/input';
import { Search, FolderCheck } from 'lucide-react';
import { toast } from 'sonner';

const CompletedProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const existingProjects = getProjects();
    setProjects(existingProjects);
  }, []);

  const handleUpdateProject = (updatedProject: Project) => {
    updateProject(updatedProject);
    setProjects(getProjects());
    setSelectedProject(updatedProject);
  };

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId);
    setProjects(getProjects());
    toast.success('Proyecto eliminado');
  };

  const completedProjects = projects.filter(p => 
    ['interrupted', 'suspended', 'cancelled', 'completed', 'delivered'].includes(p.status)
  );

  const filteredProjects = completedProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedProject) {
    return (
      <>
        <Navigation />
        <ProjectDetail
          project={selectedProject}
          onBack={() => setSelectedProject(null)}
          onUpdate={handleUpdateProject}
        />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8">
            <p className="text-muted-foreground text-lg">
              Proyectos finalizados, entregados o suspendidos
            </p>
          </header>

          <div className="flex flex-col sm:flex-row gap-4 mb-8 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar proyectos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FolderCheck className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">
                {searchQuery ? 'No se encontraron proyectos' : 'No hay proyectos completados'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {searchQuery 
                  ? 'Intenta con otro término de búsqueda'
                  : 'Los proyectos finalizados aparecerán aquí'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelect={() => setSelectedProject(project)}
                  onDelete={() => handleDeleteProject(project.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompletedProjects;
