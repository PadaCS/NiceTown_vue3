export interface Promote {
    promoteID: number;
    promotterID: number;
    promotter: number;
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

  export interface Support {
    supportID: number,
    promoteID: number, //用于检索promoteTheme
    promoteTheme: string, //显示+预览
    userID: number, //用于检索user
    user: string, //显示+预览
    supDescrip: string, //显示
    images: string, //显示
    videos: string, //显示
    createTime: string; //显示
    lastModified: string; //显示
    status: number, //显示+预览（0：待接受；1：同意；2：拒绝；3：取消）
    statusString: String,
  }

  
  export interface User {
    userID: number
    username: string
    userType: string
    fullName: string
    documentType: string
    documentID: string
    phonenumber: string
    introduction: string
    registTime: string
    lastModified: string
  }