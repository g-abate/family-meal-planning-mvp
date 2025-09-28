// Type declarations for sql.js
// Version: 1.0

declare module 'sql.js' {
  interface Database {
    run(sql: string, params?: any[]): void;
    exec(sql: string): { columns: string[]; values: any[][] }[];
    prepare(sql: string): Statement;
    export(): Uint8Array;
    close(): void;
  }

  interface Statement {
    run(params?: any[]): void;
    step(): boolean;
    get(): any[];
    getColumnNames(): string[];
    free(): void;
  }

  interface Config {
    locateFile?: (file: string) => string;
  }

  function initSqlJs(config?: Config): Promise<{
    Database: new (data?: Uint8Array) => Database;
  }>;

  export = initSqlJs;
}
