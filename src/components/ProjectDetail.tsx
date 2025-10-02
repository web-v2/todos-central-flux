import { useState } from 'react';
import { Project, Task, Commit, TaskStatus, ProjectStatus } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, Plus, CheckCircle2, Circle, Trash2, 
  GitCommit, StickyNote, PlayCircle, AlertCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onUpdate: (project: Project) => void;
}

const ProjectDetail = ({ project, onBack, onUpdate }: ProjectDetailProps) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newCommitMessage, setNewCommitMessage] = useState('');
  const [notes, setNotes] = useState(project.notes);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle.trim(),
      status: 'todo',
      createdAt: new Date().toISOString()
    };

    onUpdate({
      ...project,
      tasks: [...project.tasks, newTask]
    });
    
    setNewTaskTitle('');
    toast.success('Tarea añadida');
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    onUpdate({
      ...project,
      tasks: project.tasks.map(t => 
        t.id === taskId ? { ...t, status } : t
      )
    });
  };

  const deleteTask = (taskId: string) => {
		if (window.confirm("¿Estás seguro de eliminar esta tarea?")) {
			onUpdate({ ...project, tasks: project.tasks.filter(t => t.id !== taskId)});
		  toast.success('Tarea eliminada');
	  } else {
		  console.log("Eliminación de tarea cancelada: " + taskId);
	  }
  };

  const addCommit = () => {
    if (!newCommitMessage.trim()) return;
    
    const newCommit: Commit = {
      id: crypto.randomUUID(),
      message: newCommitMessage.trim(),
      createdAt: new Date().toISOString()
    };

    onUpdate({
      ...project,
      commits: [...project.commits, newCommit]
    });
    
    setNewCommitMessage('');
    toast.success('Commit añadido');
  };

  const deleteCommit = (commitId: string) => {
    if (window.confirm("¿Estás seguro de eliminar este commit?")) {
      onUpdate({
        ...project,
        commits: project.commits.filter(c => c.id !== commitId)
      });
      toast.success('Commit eliminado');
	  } else {
		  console.log("Eliminación de commit cancelada: " + commitId);
	  }
  };

  const saveNotes = () => {
    onUpdate({
      ...project,
      notes
    });
    toast.success('Notas guardadas');
  };

  const updateProjectStatus = (status: ProjectStatus) => {
    onUpdate({
      ...project,
      status
    });
    toast.success('Estado del proyecto actualizado');
  };

  const getStatusLabel = (status: ProjectStatus) => {
    const labels = {
      active: 'Activo',
      maintenance: 'Mantenimiento',
      interrupted: 'Interrumpido',
      suspended: 'Suspendido',
      cancelled: 'Cancelado',
      completed: 'Culminado',
      delivered: 'Entregado'
    };
    return labels[status];
  };

  const getStatusColor = (status: ProjectStatus) => {
    const colors = {
      active: 'bg-green-500',
      maintenance: 'bg-blue-500',
      interrupted: 'bg-yellow-500',
      suspended: 'bg-orange-500',
      cancelled: 'bg-red-500',
      completed: 'bg-purple-500',
      delivered: 'bg-emerald-500'
    };
    return colors[status];
  };

  const isProjectLocked = ['interrupted', 'suspended', 'cancelled', 'completed', 'delivered'].includes(project.status);

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'in-progress':
        return <PlayCircle className="h-4 w-4 text-info" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const todoTasks = project.tasks.filter(t => t.status === 'todo');
  const inProgressTasks = project.tasks.filter(t => t.status === 'in-progress');
  const doneTasks = project.tasks.filter(t => t.status === 'done');

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <h1 className="text-3xl font-bold">{project.name}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className={cn("text-white", getStatusColor(project.status))}>
              {getStatusLabel(project.status)}
            </Badge>
            <Select value={project.status} onValueChange={updateProjectStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="maintenance">Mantenimiento</SelectItem>
                <SelectItem value="interrupted">Interrumpido</SelectItem>
                <SelectItem value="suspended">Suspendido</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
                <SelectItem value="completed">Culminado</SelectItem>
                <SelectItem value="delivered">Entregado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {project.description && (
          <p className="text-muted-foreground mb-4">{project.description}</p>
        )}

        {isProjectLocked && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <p className="text-sm text-yellow-500">
              Este proyecto está en estado <strong>{getStatusLabel(project.status)}</strong>. 
              Solo se pueden editar las notas.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks Column */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Circle className="h-5 w-5" />
                  Tareas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Nueva tarea..."
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    disabled={isProjectLocked}
                  />
                  <Button onClick={addTask} size="icon" disabled={isProjectLocked}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {todoTasks.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Por Hacer</p>
                      {todoTasks.map(task => (
                        <div key={task.id} className="group flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50">
                          <button onClick={() => updateTaskStatus(task.id, 'in-progress')} disabled={isProjectLocked}>
                            {getStatusIcon(task.status)}
                          </button>
                          <span className="flex-1 text-sm">{task.title}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            onClick={() => deleteTask(task.id)}
                            disabled={isProjectLocked}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {inProgressTasks.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-info">En Proceso</p>
                        {inProgressTasks.map(task => (
                          <div key={task.id} className="group flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50">
                            <button onClick={() => updateTaskStatus(task.id, 'done')} disabled={isProjectLocked}>
                              {getStatusIcon(task.status)}
                            </button>
                            <span className="flex-1 text-sm">{task.title}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100"
                              onClick={() => deleteTask(task.id)}
                              disabled={isProjectLocked}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {doneTasks.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-success">Completadas</p>
                        {doneTasks.map(task => (
                          <div key={task.id} className="group flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50">
                            <button onClick={() => updateTaskStatus(task.id, 'todo')} disabled={isProjectLocked}>
                              {getStatusIcon(task.status)}
                            </button>
                            <span className="flex-1 text-sm line-through opacity-60">{task.title}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100"
                              onClick={() => deleteTask(task.id)}
                              disabled={isProjectLocked}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {project.tasks.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No hay tareas aún
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Commits Column */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GitCommit className="h-5 w-5" />
                  Commits Pendientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newCommitMessage}
                    onChange={(e) => setNewCommitMessage(e.target.value)}
                    placeholder="Mensaje del commit..."
                    onKeyPress={(e) => e.key === 'Enter' && addCommit()}
                    disabled={isProjectLocked}
                  />
                  <Button onClick={addCommit} size="icon" disabled={isProjectLocked}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {project.commits.map(commit => (
                    <div key={commit.id} className="group flex items-start gap-2 p-3 rounded-md border bg-card hover:bg-secondary/50">
                      <GitCommit className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <span className="flex-1 text-sm font-mono">{commit.message}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={() => deleteCommit(commit.id)}
                        disabled={isProjectLocked}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  ))}

                  {project.commits.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No hay commits pendientes
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes Column */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <StickyNote className="h-5 w-5" />
                  Notas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Escribe tus notas aquí..."
                  rows={15}
                  className="resize-none font-mono text-sm"
                />
                <Button 
                  onClick={saveNotes}
                  className="w-full"
                  disabled={notes === project.notes}
                >
                  Guardar Notas
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
