import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        constructify: "Constructify",
        solutions: "Solutions",
        industries: "Industries", 
        pricing: "Pricing",
        about: "About Us",
        contact: "Contact",
        signin: "Sign In",
        getDemo: "Get a Demo",
        profile: "Profile",
        signout: "Sign Out"
      },
      
      // Homepage
      hero: {
        title: "Build Smarter with",
        subtitle: "The Complete Construction Management Platform",
        description: "Streamline your construction projects with our comprehensive platform designed for contractors, project managers, and construction teams.",
        ctaPrimary: "Get Started",
        trustedBy: "Trusted by 500+ construction companies"
      },
      
      // Features
      features: {
        title: "Everything You Need to Manage Construction Projects",
        subtitle: "Powerful tools designed specifically for the construction industry",
        projectManagement: {
          title: "Project Management",
          description: "Track progress, manage timelines, and coordinate teams across multiple job sites."
        },
        teamCollaboration: {
          title: "Team Collaboration", 
          description: "Keep your entire team connected with real-time communication and file sharing."
        },
        resourceTracking: {
          title: "Resource Tracking",
          description: "Monitor equipment, materials, and labor costs to stay within budget."
        },
        safetyCompliance: {
          title: "Safety & Compliance",
          description: "Ensure OSHA compliance and maintain safety records for all workers."
        },
        reporting: {
          title: "Advanced Reporting",
          description: "Generate detailed reports on project progress, costs, and performance metrics."
        },
        mobileAccess: {
          title: "Mobile Access",
          description: "Access your projects from anywhere with our mobile-optimized platform."
        }
      },
      
      // Pricing
      pricing: {
        title: "Choose Your Plan",
        subtitle: "Flexible pricing for construction teams of all sizes",
        monthly: "Monthly",
        annually: "Annually",
        save: "Save 20%",
        starter: {
          name: "Starter",
          price: "$29",
          period: "/month",
          description: "Perfect for small contractors",
          features: [
            "Up to 5 projects",
            "Basic project tracking", 
            "Team collaboration tools",
            "Mobile app access",
            "Email support"
          ]
        },
        professional: {
          name: "Professional", 
          price: "$79",
          period: "/month",
          description: "For growing construction companies",
          features: [
            "Unlimited projects",
            "Advanced project management",
            "Resource & cost tracking",
            "Safety compliance tools",
            "Priority support",
            "Advanced reporting"
          ]
        },
        enterprise: {
          name: "Enterprise",
          price: "Custom",
          period: "",
          description: "For large construction organizations",
          features: [
            "Everything in Professional",
            "Custom integrations",
            "Dedicated account manager",
            "Advanced security features",
            "Custom training",
            "24/7 phone support"
          ]
        },
        getStarted: "Get Started",
        contactSales: "Contact Sales",
        popular: "Most Popular"
      },
      
      // Profile Page
      profile: {
        title: "Employee Profile",
        subtitle: "Manage your professional information and credentials",
        tabs: {
          personal: "Personal",
          professional: "Professional", 
          banking: "Banking",
          certifications: "Certifications",
          safety: "Safety",
          settings: "Settings"
        },
        personal: {
          basicInfo: "Basic Information",
          fullName: "Full Name",
          email: "Email Address",
          phone: "Phone Number",
          location: "Location",
          bio: "Professional Bio",
          jobTitle: "Job Title",
          primaryTrade: "Primary Trade",
          skillLevel: "Skill Level",
          emergencyContacts: "Emergency Contacts",
          addContact: "Add Contact",
          noContacts: "No emergency contacts added yet",
          addFirstContact: "Add Your First Emergency Contact"
        },
        professional: {
          workInfo: "Work Information",
          currentProjects: "Current Projects",
          achievements: "Achievements & Awards",
          noProjects: "No active projects",
          noAchievements: "No achievements recorded"
        },
        banking: {
          payrollInfo: "Payroll Information",
          directDeposit: "Direct Deposit",
          taxInfo: "Tax Information",
          compensation: "Compensation Details"
        },
        certifications: {
          activeCerts: "Certifications",
          addCertification: "Add Certification",
          safetyTraining: "Safety Training Records", 
          addTraining: "Add Training",
          driversLicense: "Driver's License",
          noCertifications: "No certifications added yet",
          addFirstCert: "Add Your First Certification",
          noTraining: "No training records added yet",
          addFirstTraining: "Add Your First Training Record"
        },
        safety: {
          healthRecords: "Safety & Health Records",
          drugTests: "Drug Test Records",
          backgroundCheck: "Background Check",
          incidents: "Safety Incidents",
          reportIncident: "Report Incident",
          safetyResources: "Safety Resources"
        },
        settings: {
          accountSettings: "Account Settings",
          profileType: "Profile Type",
          securityLevel: "Security Level",
          accountStatus: "Account Status"
        },
        actions: {
          editProfile: "Edit Profile",
          saveChanges: "Save Changes",
          cancel: "Cancel",
          add: "Add",
          delete: "Delete",
          edit: "Edit"
        }
      },
      
      // Forms
      forms: {
        required: "Required",
        optional: "Optional",
        save: "Save",
        cancel: "Cancel",
        loading: "Loading...",
        saving: "Saving...",
        success: "Success!",
        error: "Error occurred",
        validation: {
          required: "This field is required",
          email: "Please enter a valid email",
          phone: "Please enter a valid phone number"
        }
      },
      
      // Common
      common: {
        loading: "Loading...",
        error: "An error occurred",
        success: "Success!",
        notSet: "Not set",
        notSpecified: "Not specified",
        active: "Active",
        inactive: "Inactive",
        expired: "Expired",
        verified: "Verified",
        pending: "Pending",
        completed: "Completed",
        yes: "Yes",
        no: "No"
      }
    }
  },
  es: {
    translation: {
      // Navigation
      nav: {
        constructify: "Constructify",
        solutions: "Soluciones",
        industries: "Industrias",
        pricing: "Precios", 
        about: "Acerca de",
        contact: "Contacto",
        signin: "Iniciar Sesión",
        getDemo: "Ver Demo",
        profile: "Perfil",
        signout: "Cerrar Sesión"
      },
      
      // Homepage
      hero: {
        title: "Construye Más Inteligente con",
        subtitle: "La Plataforma Completa de Gestión de Construcción",
        description: "Optimiza tus proyectos de construcción con nuestra plataforma integral diseñada para contratistas, gerentes de proyecto y equipos de construcción.",
        ctaPrimary: "Comenzar",
        trustedBy: "Confiado por más de 500 empresas de construcción"
      },
      
      // Features
      features: {
        title: "Todo lo que Necesitas para Gestionar Proyectos de Construcción",
        subtitle: "Herramientas poderosas diseñadas específicamente para la industria de la construcción",
        projectManagement: {
          title: "Gestión de Proyectos",
          description: "Rastrea el progreso, gestiona cronogramas y coordina equipos en múltiples sitios de trabajo."
        },
        teamCollaboration: {
          title: "Colaboración en Equipo",
          description: "Mantén a todo tu equipo conectado con comunicación en tiempo real y compartir archivos."
        },
        resourceTracking: {
          title: "Seguimiento de Recursos", 
          description: "Monitorea equipos, materiales y costos de mano de obra para mantenerte dentro del presupuesto."
        },
        safetyCompliance: {
          title: "Seguridad y Cumplimiento",
          description: "Asegura el cumplimiento de OSHA y mantén registros de seguridad para todos los trabajadores."
        },
        reporting: {
          title: "Reportes Avanzados",
          description: "Genera reportes detallados sobre progreso de proyectos, costos y métricas de rendimiento."
        },
        mobileAccess: {
          title: "Acceso Móvil",
          description: "Accede a tus proyectos desde cualquier lugar con nuestra plataforma optimizada para móviles."
        }
      },
      
      // Pricing
      pricing: {
        title: "Elige Tu Plan",
        subtitle: "Precios flexibles para equipos de construcción de todos los tamaños",
        monthly: "Mensual",
        annually: "Anual", 
        save: "Ahorra 20%",
        starter: {
          name: "Inicial",
          price: "$29",
          period: "/mes",
          description: "Perfecto para pequeños contratistas",
          features: [
            "Hasta 5 proyectos",
            "Seguimiento básico de proyectos",
            "Herramientas de colaboración en equipo",
            "Acceso a aplicación móvil",
            "Soporte por email"
          ]
        },
        professional: {
          name: "Profesional",
          price: "$79", 
          period: "/mes",
          description: "Para empresas de construcción en crecimiento",
          features: [
            "Proyectos ilimitados",
            "Gestión avanzada de proyectos",
            "Seguimiento de recursos y costos",
            "Herramientas de cumplimiento de seguridad",
            "Soporte prioritario",
            "Reportes avanzados"
          ]
        },
        enterprise: {
          name: "Empresarial",
          price: "Personalizado",
          period: "",
          description: "Para grandes organizaciones de construcción",
          features: [
            "Todo en Profesional",
            "Integraciones personalizadas",
            "Gerente de cuenta dedicado",
            "Características avanzadas de seguridad",
            "Entrenamiento personalizado",
            "Soporte telefónico 24/7"
          ]
        },
        getStarted: "Comenzar",
        contactSales: "Contactar Ventas",
        popular: "Más Popular"
      },
      
      // Profile Page
      profile: {
        title: "Perfil del Empleado",
        subtitle: "Gestiona tu información profesional y credenciales",
        tabs: {
          personal: "Personal",
          professional: "Profesional",
          banking: "Bancario",
          certifications: "Certificaciones",
          safety: "Seguridad", 
          settings: "Configuración"
        },
        personal: {
          basicInfo: "Información Básica",
          fullName: "Nombre Completo",
          email: "Correo Electrónico",
          phone: "Número de Teléfono",
          location: "Ubicación",
          bio: "Biografía Profesional",
          jobTitle: "Título del Trabajo",
          primaryTrade: "Oficio Principal",
          skillLevel: "Nivel de Habilidad",
          emergencyContacts: "Contactos de Emergencia",
          addContact: "Agregar Contacto",
          noContacts: "No se han agregado contactos de emergencia",
          addFirstContact: "Agregar Tu Primer Contacto de Emergencia"
        },
        professional: {
          workInfo: "Información de Trabajo",
          currentProjects: "Proyectos Actuales",
          achievements: "Logros y Premios",
          noProjects: "No hay proyectos activos",
          noAchievements: "No hay logros registrados"
        },
        banking: {
          payrollInfo: "Información de Nómina",
          directDeposit: "Depósito Directo",
          taxInfo: "Información Fiscal",
          compensation: "Detalles de Compensación"
        },
        certifications: {
          activeCerts: "Certificaciones",
          addCertification: "Agregar Certificación",
          safetyTraining: "Registros de Capacitación en Seguridad",
          addTraining: "Agregar Capacitación",
          driversLicense: "Licencia de Conducir",
          noCertifications: "No se han agregado certificaciones",
          addFirstCert: "Agregar Tu Primera Certificación",
          noTraining: "No hay registros de capacitación",
          addFirstTraining: "Agregar Tu Primer Registro de Capacitación"
        },
        safety: {
          healthRecords: "Registros de Seguridad y Salud",
          drugTests: "Registros de Pruebas de Drogas",
          backgroundCheck: "Verificación de Antecedentes",
          incidents: "Incidentes de Seguridad",
          reportIncident: "Reportar Incidente",
          safetyResources: "Recursos de Seguridad"
        },
        settings: {
          accountSettings: "Configuración de Cuenta",
          profileType: "Tipo de Perfil",
          securityLevel: "Nivel de Seguridad",
          accountStatus: "Estado de Cuenta"
        },
        actions: {
          editProfile: "Editar Perfil",
          saveChanges: "Guardar Cambios",
          cancel: "Cancelar",
          add: "Agregar",
          delete: "Eliminar",
          edit: "Editar"
        }
      },
      
      // Forms
      forms: {
        required: "Requerido",
        optional: "Opcional",
        save: "Guardar",
        cancel: "Cancelar",
        loading: "Cargando...",
        saving: "Guardando...",
        success: "¡Éxito!",
        error: "Ocurrió un error",
        validation: {
          required: "Este campo es requerido",
          email: "Por favor ingresa un email válido",
          phone: "Por favor ingresa un número de teléfono válido"
        }
      },
      
      // Common
      common: {
        loading: "Cargando...",
        error: "Ocurrió un error",
        success: "¡Éxito!",
        notSet: "No establecido",
        notSpecified: "No especificado",
        active: "Activo",
        inactive: "Inactivo",
        expired: "Expirado",
        verified: "Verificado",
        pending: "Pendiente",
        completed: "Completado",
        yes: "Sí",
        no: "No"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 