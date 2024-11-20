export interface Promote {
    promoteID: number;
    promotterID: number;
    townID: number;
    promoteType?: string; // 可选属性
    theme: string;
    description: string;
    images: string;
    videos: string;
    createTime: string;
    lastModified: string;
    status: number;
  }
  