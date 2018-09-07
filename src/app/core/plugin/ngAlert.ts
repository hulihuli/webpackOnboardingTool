export class AlertMsg {//alertmsg
    constructor(
        public title: string,
        public type: any,//Type 'string' is not assignable to type 'SweetAlertType'.
        public text?: string,
        public timer?: number,
    ) {
    }
}