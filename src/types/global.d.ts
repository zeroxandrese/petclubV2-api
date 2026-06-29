declare namespace Express {
  export interface File {
    tempFilePath?: string;
    name?: string;
    mimetype?: string;
    size?: number;
    // buffer?: Buffer; // 
  }
}