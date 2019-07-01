import { BaseException } from "./models/baseException";
export class UrlParamService {
    // supports construction of query params by adding params prefixed with ? e.g. ?env: red
    public static getParamEndpoint(endPoint: string, params: { [id: string]: any }): string {
        let endPointWithVariables: string = endPoint;

        if (params) {
            let queryParamParts: string[] = [];
            for (let id in params) {
                if (params[id]) {
                    let subParam: string = `{${id}}`;
                    if (endPointWithVariables.indexOf(subParam) >= 0 && id.indexOf("?") !== 0) {
                        endPointWithVariables = endPointWithVariables.replace(subParam, encodeURIComponent(params[id]));
                    } else if (id.indexOf("?") === 0) {
                        queryParamParts.push(encodeURIComponent(id.substring(1)) + "=" + encodeURIComponent(params[id]));
                    } else {
                        throw new BaseException(this, "getParamEndpoint", "Substitute parameter name does not exist '{0}'", [subParam], null);
                    }
                }
            }
            if (queryParamParts.length > 0) {
                endPointWithVariables = endPointWithVariables + "?" + queryParamParts.join("&");
            }
            
        }
        return endPointWithVariables;
    }
}
