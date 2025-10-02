import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { Project } from '@/types/project';

interface CreateProjectDialogProps {
  onCreateProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const PROJECT_COLORS = [
  '#8B5CF6', '#6366F1', '#3B82F6', '#0EA5E9',
  '#14B8A6', '#10B981', '#84CC16', '#F59E0B',
  '#EF4444', '#EC4899', '#A855F7', '#6B7280'
];

const CreateProjectDialog = ({ onCreateProject }: CreateProjectDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(PROJECT_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateProject({
      name: name.trim(),
      description: description.trim(),
      color: selectedColor,
      status: 'active',
      tasks: [],
      commits: [],
      notes: ''
    });

    setName('');
    setDescription('');
    setSelectedColor(PROJECT_COLORS[0]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Nuevo Proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
            <DialogDescription>
              Añade un nuevo proyecto para organizar tus tareas y commits
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Proyecto *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mi Proyecto Awesome"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe brevemente tu proyecto..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Color del Proyecto</Label>
              <div className="flex gap-2 flex-wrap">
                {PROJECT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-8 h-8 rounded-full transition-transform hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    style={{ 
                      backgroundColor: color,
                      transform: selectedColor === color ? 'scale(1.2)' : 'scale(1)',
                      boxShadow: selectedColor === color ? `0 0 0 2px hsl(var(--background)), 0 0 0 4px ${color}` : 'none'
                    }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Crear Proyecto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
