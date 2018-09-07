import * as log from 'loglevel';
import { LogLevel } from '../core/enums';
import { environment } from '../../../config/environment/environment'
import { Constants } from '../core/common/constants';

export class Logger {
    public logger: any;
    constructor(
        public loggername: string = Constants.loggerName,//Default-initialized parameters that come after all required parameters are treated as optional
        public logLevel?: LogLevel
    ) {
        this.logger = log.getLogger(loggername);
        this.configLogLevel(logLevel);
    }

    trace(msgtitle:any,...message: Array<any>) {
        this.logger.trace(msgtitle,...message);
    }

    debug(msgtitle:any,...message: Array<any>) {
        this.logger.debug(msgtitle,...message);
    }

    info(msgtitle:any,...message: Array<any>) {
         this.logger.info(msgtitle,...message);
    }

    warn(msgtitle:any,...message: Array<any>) {
        this.logger.warn(msgtitle,...message);
    }

    error(msgtitle:any,...message: Array<any>) {
        this.logger.error(msgtitle,...message);
    }

    getLevel(): any {
        return this.logger.getLevel();
    }

    configLogLevel(logLevel?: LogLevel) {
        var finalLogLevel = environment.logLevel;
        if (logLevel != null) {
            finalLogLevel = logLevel;
        }
        switch (finalLogLevel) {
            case LogLevel.Trace: this.logger.setLevel("trace"); break;
            case LogLevel.Debug: this.logger.setLevel("debug"); break;
            case LogLevel.Info: this.logger.setLevel("info"); break;
            case LogLevel.Warn: this.logger.setLevel("warn"); break;
            case LogLevel.Error: this.logger.setLevel("error"); break;
            default: this.logger.setLevel("trace"); break;
        }
    }
}