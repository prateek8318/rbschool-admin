export const endpoints = {
  auth: {
    adminLogin: '/api/auth/admin/login',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
  },
  students: {
    list: '/students',
    detail: (id: string) => `/students/${id}`,
    create: '/students',
    update: (id: string) => `/students/${id}`,
    delete: (id: string) => `/students/${id}`,
  },
  teachers: {
    list: '/teachers',
    detail: (id: string) => `/teachers/${id}`,
  },
  classes: {
    list: '/classes',
    detail: (id: string) => `/classes/${id}`,
  },
  attendance: {
    list: '/attendance',
    mark: '/attendance',
  },
};
