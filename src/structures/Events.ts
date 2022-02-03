import FoxyClient from "../FoxyClient";

export default interface FoxyEvent {
    run: (client: FoxyClient, ...args: any[]) => any;
    default: any;
}