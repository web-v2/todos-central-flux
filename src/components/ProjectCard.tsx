import { Project } from '@/types/project';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, GitCommit, StickyNote, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onSelect: () => void;
  onDelete: () => void;
}

const ProjectCard = ({ project, onSelect, onDelete }: ProjectCardProps) => {
  const todoCount = project.tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = project.tasks.filter(t => t.status === 'in-progress').length;
  const doneCount = project.tasks.filter(t => t.status === 'done').length;
  const totalTasks = project.tasks.length;
  const progress = totalTasks > 0 ? (doneCount / totalTasks) * 100 : 0;
  
  const onDeleteConfirm = ()=>{
	  if (window.confirm("¿Estás seguro de eliminar este proyecto?")) {		  
		  onDelete();
	  } else {
		  console.log("Eliminación cancelada");
	  }
  };

  return (
    <Card 
      className="group relative overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 cursor-pointer"
      onClick={onSelect}
    >
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{ 
          background: `linear-gradient(to right, ${project.color} ${progress}%, hsl(var(--border)) ${progress}%)` 
        }}
      />
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <CardTitle className="text-xl">{project.name}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
			      title="Eliminar proyecto"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
			        onDeleteConfirm();              
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
        {project.description && (
          <CardDescription className="line-clamp-2">{project.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {todoCount > 0 && (
            <Badge variant="outline" className="gap-1">
              <Circle className="h-3 w-3" />
              {todoCount} Por hacer
            </Badge>
          )}
          {inProgressCount > 0 && (
            <Badge variant="outline" className="gap-1 border-info text-info">
              <Circle className="h-3 w-3 fill-info" />
              {inProgressCount} En proceso
            </Badge>
          )}
          {doneCount > 0 && (
            <Badge variant="outline" className="gap-1 border-success text-success">
              <CheckCircle2 className="h-3 w-3" />
              {doneCount} Completadas
            </Badge>
          )}
        </div>

        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <GitCommit className="h-4 w-4" />
            <span>{project.commits.length} commits</span>
          </div>
          {project.notes && (
            <div className="flex items-center gap-1">
              <StickyNote className="h-4 w-4" />
              <span>Notas</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
