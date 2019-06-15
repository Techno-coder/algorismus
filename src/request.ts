import {get_session_identifier} from "./authentication";
import {NZTrain} from "./sources/nztrain";
import {render_problem} from "./render";
import {hide_all_modals} from "./shortcut";

const CORS_ROUTER = "https://technocoder-cors-bypass.herokuapp.com/";

let problem_link = null;

export function on_open() {
    let status = document.getElementById("open_status");
    let button = document.getElementById("open_button");
    let element = document.getElementById("problem_link");
    let link = (element as HTMLInputElement).value;

    fetch(CORS_ROUTER + link, get_request_metadata())
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.text();
        })
        .then((data) => {
            let parser = new DOMParser();
            let problem_document = parser.parseFromString(data, "text/html");

            try {
                let source = new NZTrain;
                let problem = source.process(problem_document);
                render_problem(problem);
            } catch {
                throw Error("Failed to parse problem. Are you authenticated?");
            }

            let title = document.getElementById("information_body");
            (title as HTMLAnchorElement).href = link;

            status.textContent = "";
            problem_link = link;
            hide_all_modals();
        })
        .catch((error) => document.getElementById("open_status").textContent = error)
        .finally(() => button.classList.remove("disabled-button"));
    button.classList.add("disabled-button");
}

export function on_submit(file_data: string) {
    let source = new NZTrain();
    source.submit(problem_link, file_data);
}

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
