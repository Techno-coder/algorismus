import {CORS_ROUTER, get_request_metadata} from "./bypass";
import {get_session_identifier} from "./authentication";

const AUTHENTICITY_IDENTIFIER = "authenticity_token";
let authenticity_token = null;

export function post_submission(link_endpoint: string, form_data: FormData): Promise<void> {
    form_data.set(AUTHENTICITY_IDENTIFIER, authenticity_token);

    let metadata = get_request_metadata();
    metadata.body = form_data;
    metadata.method = "POST";

    return fetch(CORS_ROUTER + link_endpoint, metadata)
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
        });
}

export function get_authenticity_token(problem_link: string) {
    let file_selector = document.getElementById("submission_file");
    file_selector.hidden = true;

    if (get_session_identifier() == null) return;
    let link_endpoint = problem_link + "/submit";

    fetch(CORS_ROUTER + link_endpoint, get_request_metadata())
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.text();
        })
        .then((data) => {
            let parser = new DOMParser();
            let document = parser.parseFromString(data, "text/html");
            let element = document.getElementsByName(AUTHENTICITY_IDENTIFIER)[0];

            authenticity_token = (element as HTMLInputElement).value;
            file_selector.hidden = false;
        });
}
