import SQL from "mysql";
declare var Module: {
    ConfigureSQL(Config: SQL.ConnectionConfig): void;
    ChangeCacheTimer(Seconds?: number): void;
    ToggleCache(Enabled?: boolean): void;
    Query(Request: string, GetCached: boolean, RowHandler?: ((Response: any) => any) | undefined): Promise<unknown>;
};
export default Module;
