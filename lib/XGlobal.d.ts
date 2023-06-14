import Discord from "discord.js";
import Sentry from "@sentry/node";
declare var Client: Discord.Client | undefined;
declare var IsTest: boolean;
declare var EnableTestErrorCatch: boolean;
declare const _default: {
    ChangeSettings(Settings: {
        Client?: Discord.Client;
        IsTest?: boolean;
        EnableTestErrorCatch?: boolean;
    }): void;
    SetUptime(NewTime: number): void;
    SetUptimeDefault(): void;
    SetupSentry(SentrySettings: Sentry.NodeOptions, Force?: true): void;
    GetWrittenTime(): string;
    print(...Data: any[]): void;
    test(...Data: any[]): void;
    error(ExceptionMessage: string | Error): void;
    warn(ExceptionMessage: string): void;
    wait(seconds: number): Promise<unknown>;
    tick(): number;
    FindProcessArgument(Name: string): boolean;
};
export default _default;
