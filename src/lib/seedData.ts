import { Project, ProjectStatus } from '@/types/project';
import { saveProjects } from './storage';

const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#A855F7'];
const statuses: ProjectStatus[] = ['active', 'active', 'maintenance', 'active', 'maintenance', 'active', 'active', 'maintenance', 'active', 'active'];

const projectTemplates = [
  {
    name: 'E-commerce Platform',
    description: 'Plataforma de comercio electrónico con React y Stripe',
    tasks: [
      { title: 'Implementar carrito de compras', status: 'done' as const },
      { title: 'Integrar pasarela de pagos', status: 'in-progress' as const },
      { title: 'Añadir sistema de reviews', status: 'todo' as const },
      { title: 'Optimizar imágenes de productos', status: 'todo' as const }
    ],
    commits: [
      { message: 'feat: add product filtering' },
      { message: 'fix: cart not updating properly' }
    ],
    notes: 'Recordar: implementar descuentos antes del viernes. Cliente quiere demo el próximo lunes.'
  },
  {
    name: 'Dashboard Analytics',
    description: 'Dashboard de analytics con gráficas interactivas',
    tasks: [
      { title: 'Crear componentes de gráficas', status: 'done' as const },
      { title: 'Conectar API de datos', status: 'done' as const },
      { title: 'Añadir exportación a PDF', status: 'in-progress' as const },
      { title: 'Implementar filtros por fecha', status: 'todo' as const }
    ],
    commits: [
      { message: 'feat: add recharts integration' },
      { message: 'style: improve mobile responsiveness' },
      { message: 'refactor: optimize data fetching' }
    ],
    notes: 'Cliente solicita dark mode. Prioridad media.'
  },
  {
    name: 'Blog Personal',
    description: 'Blog con CMS headless y MDX',
    tasks: [
      { title: 'Setup MDX', status: 'done' as const },
      { title: 'Diseñar layout de posts', status: 'done' as const },
      { title: 'Añadir sistema de comentarios', status: 'todo' as const }
    ],
    commits: [
      { message: 'feat: add syntax highlighting' }
    ],
    notes: 'Considerar migrar a Contentful o Sanity para mejor UX del cliente.'
  },
  {
    name: 'API REST Backend',
    description: 'API con Node.js, Express y PostgreSQL',
    tasks: [
      { title: 'Setup base de datos', status: 'done' as const },
      { title: 'Implementar autenticación JWT', status: 'in-progress' as const },
      { title: 'Crear endpoints CRUD usuarios', status: 'in-progress' as const },
      { title: 'Añadir rate limiting', status: 'todo' as const },
      { title: 'Documentar con Swagger', status: 'todo' as const }
    ],
    commits: [
      { message: 'feat: add user authentication' },
      { message: 'feat: implement password hashing' },
      { message: 'test: add auth unit tests' }
    ],
    notes: 'Pendiente: revisar seguridad con el equipo. Deploy previsto para fin de mes.'
  },
  {
    name: 'Mobile App React Native',
    description: 'App móvil multiplataforma con React Native',
    tasks: [
      { title: 'Setup proyecto Expo', status: 'done' as const },
      { title: 'Diseñar navegación', status: 'done' as const },
      { title: 'Implementar login social', status: 'in-progress' as const },
      { title: 'Añadir notificaciones push', status: 'todo' as const }
    ],
    commits: [
      { message: 'feat: add navigation structure' },
      { message: 'style: implement custom theme' }
    ],
    notes: 'Testing en iOS pendiente. Necesito una Mac o usar TestFlight.'
  },
  {
    name: 'Landing Page SaaS',
    description: 'Landing page con animaciones y forms',
    tasks: [
      { title: 'Diseñar hero section', status: 'done' as const },
      { title: 'Añadir animaciones scroll', status: 'in-progress' as const },
      { title: 'Integrar formulario de contacto', status: 'todo' as const },
      { title: 'Optimizar SEO', status: 'todo' as const }
    ],
    commits: [
      { message: 'feat: add hero animations' },
      { message: 'style: responsive mobile design' }
    ],
    notes: 'Cliente quiere A/B testing. Considerar integrar Google Optimize.'
  },
  {
    name: 'CRM Internal Tool',
    description: 'Sistema CRM para gestión de clientes',
    tasks: [
      { title: 'Crear tabla de clientes', status: 'done' as const },
      { title: 'Implementar búsqueda avanzada', status: 'in-progress' as const },
      { title: 'Añadir pipeline de ventas', status: 'todo' as const },
      { title: 'Exportar reportes Excel', status: 'todo' as const },
      { title: 'Integrar email tracking', status: 'todo' as const }
    ],
    commits: [
      { message: 'feat: add customer CRUD operations' },
      { message: 'feat: implement search filters' },
      { message: 'fix: pagination not working' }
    ],
    notes: 'Reunión con stakeholders el jueves. Preparar demo de funcionalidades actuales.'
  },
  {
    name: 'Portfolio Website',
    description: 'Portfolio personal con Three.js',
    tasks: [
      { title: 'Setup Three.js scene', status: 'in-progress' as const },
      { title: 'Añadir sección de proyectos', status: 'todo' as const },
      { title: 'Crear formulario de contacto', status: 'todo' as const }
    ],
    commits: [
      { message: 'feat: add 3D background' }
    ],
    notes: 'Experimentar con shaders para efectos más cool. Ver ejemplos en awwwards.'
  },
  {
    name: 'Inventory System',
    description: 'Sistema de inventario con código de barras',
    tasks: [
      { title: 'Implementar scanner QR', status: 'done' as const },
      { title: 'Crear dashboard de stock', status: 'done' as const },
      { title: 'Añadir alertas de stock bajo', status: 'in-progress' as const },
      { title: 'Integrar con ERP existente', status: 'todo' as const },
      { title: 'Generar reportes PDF', status: 'todo' as const }
    ],
    commits: [
      { message: 'feat: add barcode scanner' },
      { message: 'feat: implement stock alerts' },
      { message: 'style: improve dashboard UI' }
    ],
    notes: 'Cliente solicita integración con SAP. Investigar APIs disponibles.'
  },
  {
    name: 'Chat Application',
    description: 'App de chat en tiempo real con WebSockets',
    tasks: [
      { title: 'Setup Socket.io', status: 'done' as const },
      { title: 'Implementar rooms', status: 'done' as const },
      { title: 'Añadir typing indicators', status: 'in-progress' as const },
      { title: 'Implementar mensajes multimedia', status: 'todo' as const },
      { title: 'Añadir encriptación E2E', status: 'todo' as const }
    ],
    commits: [
      { message: 'feat: add real-time messaging' },
      { message: 'feat: implement chat rooms' },
      { message: 'fix: message order issue' }
    ],
    notes: 'Considerar usar Redis para escalabilidad. Performance testing con 1000+ usuarios concurrentes.'
  }
];

export const generateSeedProjects = (): Project[] => {
  const now = new Date();
  
  return projectTemplates.map((template, index) => {
    const createdDate = new Date(now.getTime() - (10 - index) * 24 * 60 * 60 * 1000);
    
    return {
      id: crypto.randomUUID(),
      name: template.name,
      description: template.description,
      color: colors[index],
      status: statuses[index],
      tasks: template.tasks.map((task, taskIndex) => ({
        id: crypto.randomUUID(),
        title: task.title,
        status: task.status,
        createdAt: new Date(createdDate.getTime() + taskIndex * 60 * 60 * 1000).toISOString()
      })),
      commits: template.commits.map((commit, commitIndex) => ({
        id: crypto.randomUUID(),
        message: commit.message,
        createdAt: new Date(createdDate.getTime() + commitIndex * 2 * 60 * 60 * 1000).toISOString()
      })),
      notes: template.notes,
      createdAt: createdDate.toISOString(),
      updatedAt: new Date(createdDate.getTime() + 12 * 60 * 60 * 1000).toISOString()
    };
  });
};

export const loadSeedData = () => {
  const projects = generateSeedProjects();
  saveProjects(projects);
  return projects;
};
