# 🎯 PROMPTS SÚPER ESPECÍFICOS ECOSISTEMA COOMUNITY

## 📋 ÍNDICE
1. [Backend NestJS - Prompt Específico](#backend-nestjs---prompt-específico)
2. [Gamifier Admin - Prompt Específico](#gamifier-admin---prompt-específico)  
3. [SuperApp - Prompt Específico](#superapp---prompt-específico)
4. [Patrones Arquitectónicos Obligatorios](#patrones-arquitectónicos-obligatorios)

---

## 🏗️ BACKEND NESTJS - PROMPT ESPECÍFICO

### 📂 Estructura de Archivos Exacta
```
src/
├── main.ts                     # Bootstrap con puerto 3002, Swagger, CORS
├── app.module.ts               # Imports: LoggerModule, AuthModule, ConfigModule, PrismaModule + 12 módulos
├── app.controller.ts           # Health check endpoint
├── generated/prisma/           # Tipos Prisma generados
├── common/
│   ├── guards/                 # JwtAuthGuard, RolesGuard
│   ├── decorators/             # @Roles(), @Public()
│   ├── interceptors/           # LoggingInterceptor, TransformInterceptor
│   └── pipes/                  # ValidationPipe personalizado
├── auth/
│   ├── auth.module.ts          # JWT strategy, passport config
│   ├── auth.controller.ts      # /auth/login, /auth/me, /auth/refresh
│   ├── auth.service.ts         # bcrypt, JWT tokens, refresh logic
│   ├── strategies/             # jwt.strategy.ts, local.strategy.ts
│   ├── guards/                 # jwt-auth.guard.ts, roles.guard.ts
│   └── dto/                    # login.dto.ts, register.dto.ts
├── users/
│   ├── users.module.ts         # PrismaModule, RbacModule imports
│   ├── users.controller.ts     # CRUD + ayni metrics endpoint
│   ├── users.service.ts        # Paginación, soft delete, audit logs
│   ├── dto/                    # create-user.dto.ts, update-user.dto.ts
│   └── [users.service.simple.ts, users.service.minimal.ts]
├── marketplace/
│   ├── marketplace.module.ts   # AuthModule, RbacModule imports
│   ├── marketplace.controller.ts # Public + authenticated endpoints
│   ├── marketplace.service.ts  # Búsqueda, filtros, stats, favoritos
│   └── dto/                    # marketplace.dto.ts (enums + interfaces)
├── challenges/
│   ├── challenges.module.ts    # MeritsAndWalletModule integration
│   ├── challenges.controller.ts # CRUD challenges
│   ├── challenges.service.ts   # Gamification logic, rewards
│   └── user-challenges/        # Progress tracking
├── merits-and-wallet/
│   ├── merits-and-wallet.module.ts
│   ├── transactions/           # TransactionsService para recompensas
│   └── dto/                    # Lükas, Öndas, Mëritos DTOs
└── [social, playlist, analytics, notifications, study-rooms, subtitle, feedback, console, monitoring, admin]/
```

### 🔧 Patrones de Código Específicos

#### Inyección de Dependencias Obligatoria:
```typescript
@Injectable()
export class UsersService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}
}
```

#### Controller Pattern con Swagger:
```typescript
@ApiTags('users')
@Controller('users')
export class UsersController {
  @Get()
  @ApiOperation({ summary: 'Obtener usuarios paginados' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  async findAll(@Query() dto: GetUsersDto) {}
}
```

#### Service Pattern con Paginación:
```typescript
async findAllPaginated(params: {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: { email?: string; is_active?: boolean; };
}) {
  const [data, total] = await Promise.all([
    this.prisma.user.findMany({ /* query */ }),
    this.prisma.user.count({ /* where */ })
  ]);
  return { data, count: data.length, total, page, pageSize };
}
```

#### Soft Delete Pattern:
```typescript
async remove(id: string, user: any): Promise<User> {
  const softDeletedUser = await this.prisma.user.update({
    where: { id },
    data: { isActive: false, deletedAt: new Date() },
  });
  return softDeletedUser;
}
```

#### Sistema Ayni Específico:
```typescript
async getAyniMetrics(userId: string) {
  return {
    ondas: 1000 + (user.id.length * 47),
    meritos: 50 + (user.id.length * 7),
    balanceAyni: Math.min(1, 0.6 + (user.id.length * 0.02)),
    ayniLevel: this.calculateAyniLevel(user),
    elementos: this.calculateElementalBalance(user),
    // ... más métricas específicas CoomÜnity
  };
}
```

### 🗄️ Configuración Prisma Obligatoria:
```typescript
// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  isActive  Boolean  @default(true)
  deletedAt DateTime?
  // ... campos específicos
}

model MarketplaceItem {
  itemType     MarketplaceItemType
  price        Float
  priceToins   Float               @default(0)
  currency     String              @default("LUKAS")
  tags         String[]
  images       String[]
  viewCount    Int                 @default(0)
  isDeleted    Boolean             @default(false)
  // ... más campos
}
```

---

## 🎮 GAMIFIER ADMIN - PROMPT ESPECÍFICO

### 📂 Estructura de Archivos Exacta
```
src/
├── main.tsx                    # ReactDOM.render con StrictMode
├── App.tsx                     # Router + ThemeProvider + QueryClient
├── pages/
│   ├── UsersPage.tsx           # DataTable + CRUD dialogs + permisos
│   ├── VideoConfigPage.tsx     # Gestión multimedia + upload
│   ├── MarketplacePage.tsx     # Admin marketplace + stats
│   ├── ChallengesPage.tsx      # Gamification management
│   ├── AnalyticsPage.tsx       # Dashboard con métricas
│   └── [...20+ páginas más]
├── components/
│   ├── common/
│   │   ├── DataTable/          # Paginación + sorting + filtering
│   │   ├── ConfirmDialog/      # Confirmaciones estándar
│   │   └── Icons/              # Material UI icons wrapper
│   ├── features/
│   │   └── users/
│   │       └── UserForm.tsx    # React Hook Form + Zod validation
│   └── layout/
│       └── AdminLayout.tsx     # Sidebar + AppBar + breadcrumbs
├── hooks/
│   ├── useUsersQuery.ts        # React Query con paginación
│   ├── useCreateUserMutation.ts # Mutation con invalidación
│   ├── useHasRole.ts           # Permission checking
│   └── features/users/         # Feature-specific hooks
├── services/
│   └── api.ts                  # Axios instance con interceptors
├── types/
│   └── user.types.ts           # TypeScript interfaces
├── constants/
│   ├── roles.ts                # USER_ROLES object
│   └── queryKeys.ts            # QUERY_KEYS object
└── store/
    └── authStore.ts            # Zustand store
```

### 🔧 Patrones de Código Específicos

#### DataTable Component Pattern:
```typescript
const userColumns: ColumnDefinition<User>[] = [
  {
    header: t('table_header_email'),
    field: 'email',
    width: '25%',
    sortField: 'email',
  },
  {
    header: t('table_header_actions'),
    width: '10%',
    render: (user) => (
      <IconButton onClick={(e) => { e.stopPropagation(); handleEdit(user); }}>
        <EditIcon />
      </IconButton>
    ),
  },
];
```

#### React Query Hook Pattern:
```typescript
export const useUsersQuery = (params: UsersQueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, params],
    queryFn: () => api.get('/users', { params }),
    staleTime: 5 * 60 * 1000,
  });
};
```

#### Mutation Hook Pattern:
```typescript
export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserData) => api.post('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      toast.success(t('user_created_successfully'));
    },
  });
};
```

#### Permission Guard Pattern:
```typescript
const canCreateUsers = useHasRole(USER_ROLES.SUPER_ADMIN);
const canEditUsers = useHasRole(USER_ROLES.SUPER_ADMIN);

// En el JSX:
{canCreateUsers && (
  <Button variant="contained" onClick={() => setDialogOpen(true)}>
    {t('button_create_user')}
  </Button>
)}
```

#### Form Pattern con React Hook Form:
```typescript
const UserForm: React.FC<UserFormProps> = ({ onSubmit, defaultValues, isEdit }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues,
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />
    </form>
  );
};
```

---

## 📱 SUPERAPP - PROMPT ESPECÍFICO

### 📂 Estructura de Archivos Exacta
```
src/
├── main.tsx                    # ReactDOM + Service Worker
├── App.tsx                     # Router + Providers + Lazy Loading
├── pages/
│   ├── HomePage.tsx            # Dashboard con métricas usuario
│   ├── Profile.tsx             # 2169 líneas - perfil completo
│   ├── Marketplace.tsx         # GMP - productos/servicios
│   ├── UPlay.tsx               # GPL - video player gamificado
│   ├── Wallet.tsx              # Lükas + Öndas + transferencias
│   ├── ChallengesPage.tsx      # Desafíos con progreso
│   └── [...15+ páginas más]
├── components/
│   ├── ui/                     # Button, Card, Modal base components
│   ├── layout/                 # AppLayout con navigation
│   ├── onboarding/             # OnboardingChecklist, ProgressiveTooltips
│   ├── tutorials/              # DiscoveryTutorial sistema
│   └── modules/                # Feature-specific components
├── contexts/
│   ├── AuthContext.tsx         # JWT + user state
│   ├── ThemeContext.tsx        # Dark/Light mode + CoomÜnity colors
│   └── FeedbackContext.tsx     # Toast notifications
├── hooks/
│   ├── useUserProfile.ts       # Profile data + gamification metrics
│   ├── useAuth.ts              # Authentication logic
│   └── useApi.ts               # API calls con error handling
├── utils/
│   ├── lazyComponents.ts       # Lazy loading + preloading
│   └── numberUtils.ts          # Safe formatting functions
├── stores/
│   └── authStore.ts            # Zustand store
└── styles/
    ├── index.css               # Global Tailwind + custom vars
    └── profile-enhanced.css    # Component-specific styles
```

### 🔧 Patrones de Código Específicos

#### Lazy Loading Pattern:
```typescript
export const LazyPages = {
  HomePage: lazy(() => import('../pages/HomePage')),
  Marketplace: lazy(() => import('../pages/Marketplace')),
  UPlayPage: lazy(() => import('../pages/UPlay')),
};

export const preloadCriticalComponents = () => {
  LazyPages.HomePage;
  LazyPages.Marketplace;
};

export const preloadRouteComponents = (pathname: string) => {
  switch (pathname) {
    case '/marketplace': LazyPages.Marketplace; break;
    case '/uplay': LazyPages.UPlayPage; break;
  }
};
```

#### Authentication Context Pattern:
```typescript
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

#### CoomÜnity Color System:
```typescript
const coomunityColors = {
  merito: '#FFD700',    // Dorado para Mëritos
  onda: '#00CED1',      // Turquesa para Öndas
  ayni: '#9C27B0',      // Púrpura para Ayni
  marketplace: '#4CAF50', // Verde para Marketplace
  uplay: '#FF5722',     // Rojo para ÜPlay
};
```

#### Gamification Metrics Pattern:
```typescript
const MetricCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  progress?: number;
}> = ({ title, value, icon, color, progress }) => (
  <Card sx={{
    background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
    '&:hover': { transform: 'translateY(-4px)' },
  }}>
    <Avatar sx={{ bgcolor: color }}>{icon}</Avatar>
    <Typography variant="h4" sx={{ color }}>{value}</Typography>
    {progress && <LinearProgress value={progress} />}
  </Card>
);
```

#### Safe Date Formatting:
```typescript
const formatSafeDate = (dateString?: string, options?: Intl.DateTimeFormatOptions): string => {
  if (!dateString) return 'No especificada';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    return date.toLocaleDateString('es-ES', options);
  } catch (error) {
    return 'Error en fecha';
  }
};
```

#### API Hook Pattern:
```typescript
export const useCurrentUserProfile = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: () => apiService.get('/users/me'),
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
};

export const useGamificationMetrics = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['ayni-metrics', user?.id],
    queryFn: () => apiService.get(`/users/${user?.id}/ayni-metrics`),
    enabled: !!user?.id,
  });
};
```

---

## 🎯 PATRONES ARQUITECTÓNICOS OBLIGATORIOS

### 1. **Inyección de Dependencias Backend**
```typescript
// OBLIGATORIO: @Inject explícito
constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}
```

### 2. **React Query + Zustand Frontend**
```typescript
// State management: Zustand
// Server state: React Query
// Forms: React Hook Form + Zod
```

### 3. **Error Handling Pattern**
```typescript
// Backend: try-catch + custom exceptions
// Frontend: React Query error states + toast notifications
```

### 4. **Filosofía CoomÜnity Integration**
```typescript
// Ayni metrics en user service
// Colores específicos CoomÜnity
// Terminología: Lükas, Öndas, Mëritos, Bien Común
```

### 5. **Material UI + Tailwind Pattern (SuperApp)**
```typescript
// MUI para componentes base
// Tailwind para utility classes
// sx prop para custom styling
```

### 6. **API Response Pattern**
```typescript
// Paginación: { data, total, page, pageSize, hasMore }
// Búsqueda: { items, total, limit, offset }
// CRUD: Return entity con includes específicos
```

### 7. **Soft Delete + Audit Pattern**
```typescript
// isActive: false para soft delete
// Audit logs para acciones críticas
// createdAt, updatedAt, deletedAt timestamps
```

---

**🔥 Estos prompts son EXACTOS basados en el código real del ecosistema CoomÜnity. Incluyen patrones específicos, estructuras de archivos reales y filosofía implementada.**
