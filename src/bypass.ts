import {get_session_identifier} from "./authentication";

export const CORS_ROUTER = "https://technocoder-cors-bypass.herokuapp.com/";

export function resource_image(element: HTMLImageElement) {
    let image_identifier = element.id;
    let image_source = element.src;
    element.src = "";

    fetch(CORS_ROUTER + image_source, get_request_metadata())
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.blob();
        })
        .then((data) => {
            let element = document.getElementById(image_identifier);
            (element as HTMLImageElement).src = URL.createObjectURL(data);
        });
}

export function get_request_metadata(): RequestInit {
    let request: RequestInit = {};
    if (get_session_identifier() == null) {
        return request;
    }

    request.credentials = "include";
    request.headers = {"Forward-Cookie": "_session_id=" + get_session_identifier()};
    return request as RequestInit;
}
