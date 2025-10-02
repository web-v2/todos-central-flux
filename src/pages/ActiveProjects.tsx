import { useState, useEffect } from 'react';
import { Project } from '@/types/project';
import { getProjects, addProject, updateProject, deleteProject } from '@/lib/storage';
//import { loadSeedData } from '@/lib/seedData';
import ProjectCard from '@/components/ProjectCard';
import CreateProjectDialog from '@/components/CreateProjectDialog';
import ProjectDetail from '@/components/ProjectDetail';
import Navigation from '@/components/Navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Package, Code2 } from 'lucide-react';
import { toast } from 'sonner';

const ActiveProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const existingProjects = getProjects();
    setProjects(existingProjects);
    
    /*if (existingProjects.length === 0) {
      const seedProjects = loadSeedData();
      setProjects(seedProjects);
      toast.success('Se cargaron 10 proyectos de ejemplo');
    }*/
  }, []);

  const handleCreateProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addProject(newProject);
    setProjects(getProjects());
    toast.success('Proyecto creado exitosamente');
  };

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

  /*const handleLoadSeedData = () => {
    const seedProjects = loadSeedData();
    setProjects(seedProjects);
    toast.success('Se cargaron 10 proyectos de ejemplo');
  };*/

  const activeProjects = projects.filter(p => 
    ['active', 'maintenance'].includes(p.status)
  );

  const filteredProjects = activeProjects.filter(project =>
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
              Proyectos en ejecución y mantenimiento
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

            <CreateProjectDialog onCreateProject={handleCreateProject} />
          </div>

          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Code2 className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">
                {searchQuery ? 'No se encontraron proyectos' : 'No hay proyectos activos'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {searchQuery 
                  ? 'Intenta con otro término de búsqueda'
                  : 'Crea tu primer proyecto y empieza a organizar tu trabajo'
                }
              </p>
              {!searchQuery && <CreateProjectDialog onCreateProject={handleCreateProject} />}
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

export default ActiveProjects;
