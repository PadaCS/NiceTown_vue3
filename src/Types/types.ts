export interface Promote {
    promoteID: number;
    promotterID: number;
    townID: number;
    townFullName:any;//用来存乡镇全名
    promoteType?: string; // 可选属性
    theme: string;
    description: string;
    images: string;
    videos: string;
    createTime: string;
    lastModified: string;
    status: number;
  }
  

  export interface Towns {
    townID: number,
    name: string,
    city: string,
    province: string,
  }
