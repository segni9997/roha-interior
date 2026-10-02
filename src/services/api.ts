/**
 * ROHA Architectural Studio — Centralized API Client Service
 * Connects public frontend and executive admin portal to Django REST backend
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export function resolveImageUrl(url?: string | null, fallback: string = '/tr/279A1756.JPG'): string {
  if (!url) return fallback;
  let clean = url.trim();

  // Strip accidental double /uploads or nested domains
  if (clean.includes('/uploads/http')) {
    const parts = clean.split('/uploads/http');
    clean = 'http' + parts[1];
    clean = decodeURIComponent(clean);
  }
  if (clean.includes('/uploads//uploads/')) {
    clean = clean.replace('/uploads//uploads/', '/uploads/');
  }

  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }
  if (clean.startsWith('/uploads') || clean.startsWith('/media')) {
    return `${API_BASE_URL}${clean}`;
  }
  if (clean.startsWith('uploads/') || clean.startsWith('media/')) {
    return `${API_BASE_URL}/${clean}`;
  }
  return clean;
}

// -------------------------------------------------------------
// Interfaces matching Django DRF Serializers
// -------------------------------------------------------------

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description?: string;
  projects_count?: number;
}

export interface InteriorProjectItem {
  id: number;
  title: string;
  slug: string;
  category: number;
  category_id?: number;
  category_name: string;
  location: string;
  year: string;
  description: string;
  subtitle?: string;
  video_url?: string;
  cover_image: string | null;
  company_logo?: string | null;
  is_featured: boolean;
  order: number;
}

export interface InteriorSpecificationItem {
  area: string;
  floors: number;
  style: string;
  material_palette: string;
  lighting_design: string;
  duration: string;
  budget: string;
  architect: string;
  client: string;
  status: string;
}

export interface GalleryImageItem {
  id: number;
  image: string;
  caption?: string;
  subtitle?: string;
  order?: number;
}

export interface InteriorGalleryImageItem extends GalleryImageItem {
  caption: string;
  order: number;
}

export interface InteriorProjectDetailItem extends InteriorProjectItem {
  specifications?: InteriorSpecificationItem;
  gallery_images?: GalleryImageItem[];
}

export interface ModelProjectItem {
  id: number;
  title: string;
  slug: string;
  category: number;
  category_id?: number;
  category_name: string;
  scale_ratio: string;
  year: string;
  day: string;
  precision_tolerance: string;
  materials_used: string;
  fabrication_methods: string;
  description: string;
  subtitle?: string;
  video_url?: string;
  cover_image: string | null;
  company_logo?: string | null;
  is_featured: boolean;
  order: number;
}

export interface ModelProjectDetailItem extends ModelProjectItem {
  dimensions_cm?: string;
  illumination?: string;
  specifications?: {
    scale: string;
    tolerance: string;
    base_material: string;
    finish: string;
    lead_time: string;
    client: string;
    status: string;
  };
  gallery_images?: GalleryImageItem[];
}

export interface TrustedClientItem {
  id: number;
  name: string;
  logo: string | null;
  industry: string;
  project_count?: string;
  featured: boolean;
  order: number;
  website_url?: string;
}

export interface ModelGalleryImageItem extends GalleryImageItem {
  caption: string;
  order: number;
}

export interface BlogPostItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  category_id?: number;
  type: string;
  year: string;
  author: string;
  author_id?: number;
  readTime: string;
  image: string | null;
  cover_image?: string | null;
  gallery_images?: GalleryImageItem[];
  is_published?: boolean;
  content?: {
    type: 'paragraph' | 'heading' | 'list';
    text?: string;
    items?: string[];
  }[];
}

export interface HotspotItem {
  pitch: number;
  yaw: number;
  type: 'scene' | 'info';
  text: string;
  sceneId?: string;
  targetYaw?: number;
  targetPitch?: number;
  cssClass?: string;
}

export interface PanoramicSceneItem {
  id: string;
  name: string;
  panorama: string;
  initial_yaw: number;
  initial_pitch: number;
  order?: number;
  hotSpots: HotspotItem[];
}

export interface PanoramicTourItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  cover_image: string | null;
  is_featured: boolean;
  panoramicScenes: PanoramicSceneItem[];
  gallery_images?: GalleryImageItem[];
}


export interface PageSectionItem {
  id: number;
  section_key: string;
  heading: string;
  subheading: string;
  body_text: string;
  background_image: string | null;
  cta_text: string;
  cta_link: string;
  order: number;
}

export interface PageContentItem {
  id: number;
  slug: string;
  title: string;
  meta_description: string;
  sections: PageSectionItem[];
}

export interface ContactInquiryItem {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  service_interest: string;
  message: string;
  status: string;
  created_at: string;
}

export interface StudioProfileItem {
  id: number;
  studio_name: string;
  tagline: string;
  about_narrative: string;
  address: string;
  email: string;
  phone: string;
  whatsapp: string;
  office_hours: string;
  twitter_url: string;
  instagram_url: string;
  linkedin_url: string;
}

export interface StudioMetricItem {
  id: number;
  metric_number: string;
  unit: string;
  label: string;
  order: number;
}

// -------------------------------------------------------------
// Core Request Method
// -------------------------------------------------------------

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const rawText = await response.text();
    let errorDetail = rawText || response.statusText;
    try {
      const errJson = JSON.parse(rawText);
      errorDetail = errJson.detail || errJson.error || errJson.message || (typeof errJson === 'string' ? errJson : JSON.stringify(errJson));
    } catch {
      // Non-JSON response (e.g. HTML 404/500 error page or raw text)
      if (rawText.length > 200) {
        errorDetail = `${response.statusText} (${response.status})`;
      }
    }
    throw new Error(`API Error ${response.status} on ${endpoint}: ${errorDetail}`);
  }

  if (response.status === 204) {
    return {} as T;
  }
  return response.json() as Promise<T>;
}

// -------------------------------------------------------------
// Complete API Client
// -------------------------------------------------------------

export const api = {
  // Authentication
  async adminLogin(username: string, password: string):Promise<{ status: string; user: AdminUser; token: string }> {
    return request('/api/v1/core/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  // Device File Upload (Images & Videos)
  async uploadFile(file: File): Promise<{ url: string; filename: string; size: number; content_type?: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/v1/core/upload/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const rawText = await response.text();
      let errText = rawText || response.statusText;
      try {
        const errJson = JSON.parse(rawText);
        errText = errJson.detail || errJson.error || errJson.message || (typeof errJson === 'string' ? errJson : JSON.stringify(errJson));
      } catch {
        if (rawText.length > 200) {
          errText = `${response.statusText} (${response.status})`;
        }
      }
      throw new Error(`Upload failed (${response.status}): ${errText}`);
    }

    return response.json();
  },

  // Batch Multi-File Upload Helper
  async uploadMultipleFiles(
    files: File[], 
    onProgress?: (completed: number, total: number, currentFile: string) => void
  ): Promise<Array<{ url: string; filename: string; size: number; originalName: string }>> {
    const results: Array<{ url: string; filename: string; size: number; originalName: string }> = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (onProgress) {
        onProgress(i, files.length, file.name);
      }
      const res = await api.uploadFile(file);
      results.push({
        url: res.url,
        filename: res.filename,
        size: res.size,
        originalName: file.name
      });
      if (onProgress) {
        onProgress(i + 1, files.length, file.name);
      }
    }
    return results;
  },

  // Interior Architecture Projects

  async getInteriorProjects(category?: string): Promise<InteriorProjectItem[]> {
    const query = category && category !== 'All' ? `?category__name=${encodeURIComponent(category)}` : '';
    const res = await request<PaginatedResponse<InteriorProjectItem>>(`/api/v1/interior/projects/${query}`);
    return res.results;
  },

  async getInteriorProject(id: number): Promise<InteriorProjectDetailItem> {
    return request<InteriorProjectDetailItem>(`/api/v1/interior/projects/${id}/`);
  },

  async createInteriorProject(data: Partial<InteriorProjectDetailItem>): Promise<InteriorProjectDetailItem> {
    return request<InteriorProjectDetailItem>(`/api/v1/interior/projects/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateInteriorProject(id: number, data: Partial<InteriorProjectDetailItem>): Promise<InteriorProjectDetailItem> {
    return request<InteriorProjectDetailItem>(`/api/v1/interior/projects/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteInteriorProject(id: number): Promise<void> {
    return request<void>(`/api/v1/interior/projects/${id}/`, { method: 'DELETE' });
  },

  // Interior Gallery Images
  async getInteriorGalleryImages(projectId: number): Promise<InteriorGalleryImageItem[]> {
    return request<InteriorGalleryImageItem[]>(`/api/v1/interior/projects/${projectId}/gallery/`);
  },

  async addInteriorGalleryImage(projectId: number, data: { image: string; caption?: string; subtitle?: string; order?: number }): Promise<InteriorGalleryImageItem> {
    return request<InteriorGalleryImageItem>(`/api/v1/interior/projects/${projectId}/gallery/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteInteriorGalleryImage(imageId: number): Promise<void> {
    return request<void>(`/api/v1/interior/gallery/${imageId}/`, { method: 'DELETE' });
  },

  async getInteriorCategories(): Promise<CategoryItem[]> {
    return request<CategoryItem[]>(`/api/v1/interior/categories/`);
  },

  async createInteriorCategory(name: string, description?: string): Promise<CategoryItem> {
    return request<CategoryItem>(`/api/v1/interior/categories/`, {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  },

  async updateInteriorCategory(id: number, data: Partial<CategoryItem>): Promise<CategoryItem> {
    return request<CategoryItem>(`/api/v1/interior/categories/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteInteriorCategory(id: number): Promise<void> {
    return request<void>(`/api/v1/interior/categories/${id}/`, { method: 'DELETE' });
  },

  // Physical Scale Models
  async getModelProjects(category?: string): Promise<ModelProjectItem[]> {
    const query = category && category !== 'All' ? `?category__name=${encodeURIComponent(category)}` : '';
    const res = await request<PaginatedResponse<ModelProjectItem>>(`/api/v1/modelmaking/projects/${query}`);
    return res.results;
  },

  async getModelProject(id: number): Promise<ModelProjectDetailItem> {
    return request<ModelProjectDetailItem>(`/api/v1/modelmaking/projects/${id}/`);
  },

  async createModelProject(data: Partial<ModelProjectDetailItem>): Promise<ModelProjectDetailItem> {
    return request<ModelProjectDetailItem>(`/api/v1/modelmaking/projects/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateModelProject(id: number, data: Partial<ModelProjectDetailItem>): Promise<ModelProjectDetailItem> {
    return request<ModelProjectDetailItem>(`/api/v1/modelmaking/projects/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteModelProject(id: number): Promise<void> {
    return request<void>(`/api/v1/modelmaking/projects/${id}/`, { method: 'DELETE' });
  },

  // Model Gallery Images
  async getModelGalleryImages(projectId: number): Promise<InteriorGalleryImageItem[]> {
    return request<InteriorGalleryImageItem[]>(`/api/v1/modelmaking/projects/${projectId}/gallery/`);
  },

  async addModelGalleryImage(projectId: number, data: { image: string; caption?: string; subtitle?: string; order?: number }): Promise<InteriorGalleryImageItem> {
    return request<InteriorGalleryImageItem>(`/api/v1/modelmaking/projects/${projectId}/gallery/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteModelGalleryImage(imageId: number): Promise<void> {
    return request<void>(`/api/v1/modelmaking/gallery/${imageId}/`, { method: 'DELETE' });
  },

  async getModelCategories(): Promise<CategoryItem[]> {
    return request<CategoryItem[]>(`/api/v1/modelmaking/categories/`);
  },

  async createModelCategory(name: string, description?: string): Promise<CategoryItem> {
    return request<CategoryItem>(`/api/v1/modelmaking/categories/`, {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  },

  async updateModelCategory(id: number, data: Partial<CategoryItem>): Promise<CategoryItem> {
    return request<CategoryItem>(`/api/v1/modelmaking/categories/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteModelCategory(id: number): Promise<void> {
    return request<void>(`/api/v1/modelmaking/categories/${id}/`, { method: 'DELETE' });
  },

  // Blog / Journal Articles
  async getBlogPosts(category?: string): Promise<BlogPostItem[]> {
    const query = category && category !== 'All' ? `?category__name=${encodeURIComponent(category)}` : '';
    const res = await request<PaginatedResponse<BlogPostItem>>(`/api/v1/blog/posts/${query}`);
    return res.results;
  },

  async getBlogPost(id: number): Promise<BlogPostItem> {
    return request<BlogPostItem>(`/api/v1/blog/posts/${id}/`);
  },

  async createBlogPost(data: Partial<BlogPostItem>): Promise<BlogPostItem> {
    return request<BlogPostItem>(`/api/v1/blog/posts/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateBlogPost(id: number, data: Partial<BlogPostItem>): Promise<BlogPostItem> {
    return request<BlogPostItem>(`/api/v1/blog/posts/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteBlogPost(id: number): Promise<void> {
    return request<void>(`/api/v1/blog/posts/${id}/`, { method: 'DELETE' });
  },

  // Blog Gallery Images
  async getBlogGalleryImages(postId: number): Promise<GalleryImageItem[]> {
    return request<GalleryImageItem[]>(`/api/v1/blog/posts/${postId}/gallery/`);
  },

  async addBlogGalleryImage(postId: number, data: { image: string; caption?: string; subtitle?: string; order?: number }): Promise<GalleryImageItem> {
    return request<GalleryImageItem>(`/api/v1/blog/posts/${postId}/gallery/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteBlogGalleryImage(imageId: number): Promise<void> {
    return request<void>(`/api/v1/blog/gallery/${imageId}/`, { method: 'DELETE' });
  },

  async getBlogCategories(): Promise<CategoryItem[]> {
    return request<CategoryItem[]>(`/api/v1/blog/categories/`);
  },

  // 360 Virtual Reality Tours
  async getPanoramicTours(): Promise<PanoramicTourItem[]> {
    const res = await request<PaginatedResponse<PanoramicTourItem>>(`/api/v1/panoramas/tours/`);
    return res.results;
  },

  async getPanoramicTour(id: number): Promise<PanoramicTourItem> {
    return request<PanoramicTourItem>(`/api/v1/panoramas/tours/${id}/`);
  },

  async createPanoramicTour(data: Partial<PanoramicTourItem>): Promise<PanoramicTourItem> {
    return request<PanoramicTourItem>(`/api/v1/panoramas/tours/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updatePanoramicTour(id: number, data: Partial<PanoramicTourItem>): Promise<PanoramicTourItem> {
    return request<PanoramicTourItem>(`/api/v1/panoramas/tours/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deletePanoramicTour(id: number): Promise<void> {
    return request<void>(`/api/v1/panoramas/tours/${id}/`, { method: 'DELETE' });
  },

  // Tour Gallery Images
  async getTourGalleryImages(tourId: number): Promise<GalleryImageItem[]> {
    return request<GalleryImageItem[]>(`/api/v1/panoramas/tours/${tourId}/gallery/`);
  },

  async addTourGalleryImage(tourId: number, data: { image: string; caption?: string; subtitle?: string; order?: number }): Promise<GalleryImageItem> {
    return request<GalleryImageItem>(`/api/v1/panoramas/tours/${tourId}/gallery/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteTourGalleryImage(imageId: number): Promise<void> {
    return request<void>(`/api/v1/panoramas/gallery/${imageId}/`, { method: 'DELETE' });
  },

  async createPanoramicScene(tourId: number, data: Partial<PanoramicSceneItem>): Promise<PanoramicSceneItem> {
    return request<PanoramicSceneItem>(`/api/v1/panoramas/tours/${tourId}/scenes/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deletePanoramicScene(id: number): Promise<void> {
    return request<void>(`/api/v1/panoramas/scenes/${id}/`, { method: 'DELETE' });
  },


  // Page Content Builder
  async getPages(): Promise<PageContentItem[]> {
    return request<PageContentItem[]>(`/api/v1/core/pages/`);
  },

  async getPageContent(slug: string): Promise<PageContentItem> {
    return request<PageContentItem>(`/api/v1/core/pages/${slug}/`);
  },

  async getPageSections(pageSlug: string): Promise<PageSectionItem[]> {
    return request<PageSectionItem[]>(`/api/v1/core/pages/${pageSlug}/sections/`);
  },

  async createPageSection(pageSlug: string, data: Partial<PageSectionItem>): Promise<PageSectionItem> {
    return request<PageSectionItem>(`/api/v1/core/pages/${pageSlug}/sections/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updatePageSection(id: number, data: Partial<PageSectionItem>): Promise<PageSectionItem> {
    return request<PageSectionItem>(`/api/v1/core/sections/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deletePageSection(id: number): Promise<void> {
    return request<void>(`/api/v1/core/sections/${id}/`, { method: 'DELETE' });
  },

  // Client Consultation Inquiries
  async getInquiries(): Promise<ContactInquiryItem[]> {
    const res = await request<PaginatedResponse<ContactInquiryItem>>(`/api/v1/inquiries/list/`);
    return res.results;
  },

  async getInquiry(id: number): Promise<ContactInquiryItem> {
    return request<ContactInquiryItem>(`/api/v1/inquiries/${id}/`);
  },

  async updateInquiry(id: number, data: Partial<ContactInquiryItem>): Promise<ContactInquiryItem> {
    return request<ContactInquiryItem>(`/api/v1/inquiries/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteInquiry(id: number): Promise<void> {
    return request<void>(`/api/v1/inquiries/${id}/`, { method: 'DELETE' });
  },

  async submitInquiry(payload: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    service_interest: string;
    message: string;
  }) {
    return request<{ status: string; message: string; data: any }>(`/api/v1/inquiries/submit/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Studio Profile & Metrics
  async getStudioProfile(): Promise<StudioProfileItem> {
    return request<StudioProfileItem>(`/api/v1/core/studio-profile/`);
  },

  async updateStudioProfile(data: Partial<StudioProfileItem>): Promise<StudioProfileItem> {
    return request<StudioProfileItem>(`/api/v1/core/studio-profile/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async getMetrics(): Promise<StudioMetricItem[]> {
    return request<StudioMetricItem[]>(`/api/v1/core/metrics/`);
  },

  async createMetric(data: Partial<StudioMetricItem>): Promise<StudioMetricItem> {
    return request<StudioMetricItem>(`/api/v1/core/metrics/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateMetric(id: number, data: Partial<StudioMetricItem>): Promise<StudioMetricItem> {
    return request<StudioMetricItem>(`/api/v1/core/metrics/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteMetric(id: number): Promise<void> {
    return request<void>(`/api/v1/core/metrics/${id}/`, { method: 'DELETE' });
  },

  // Trusted Clients & Partners
  async getTrustedClients(): Promise<TrustedClientItem[]> {
    return request<TrustedClientItem[]>(`/api/v1/core/clients/`);
  },

  async createTrustedClient(data: Partial<TrustedClientItem>): Promise<TrustedClientItem> {
    return request<TrustedClientItem>(`/api/v1/core/clients/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateTrustedClient(id: number, data: Partial<TrustedClientItem>): Promise<TrustedClientItem> {
    return request<TrustedClientItem>(`/api/v1/core/clients/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteTrustedClient(id: number): Promise<void> {
    return request<void>(`/api/v1/core/clients/${id}/`, { method: 'DELETE' });
  },
};
