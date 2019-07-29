import {render_problem} from "./render/problem";
import {hide_all_modals} from "./shortcut";
import {CORS_ROUTER, get_request_metadata} from "./bypass";
import {get_authenticity_token} from "./submit";
import {notify_submission, render_submission_stubs} from "./render/submission";
import {NZTrain} from "./sources/nztrain/source";
import {Source} from "./source";
import {Problem} from "./problem";

let source: Source | null = null;
let problem: Problem | null = null;
let problem_link: string | null = null;
let submissions_timer: number | null = null;

const SUBMISSION_TIMER_INTERVAL = 3000;

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
                source = new NZTrain();
                problem = source.process(problem_document);
                render_problem(problem);
            } catch {
                throw Error("Failed to parse problem. Are you authenticated?");
            }

            let title = document.getElementById("information_body");
            (title as HTMLAnchorElement).href = link;
            get_authenticity_token(link);

            status.textContent = "";
            problem_link = link;
            hide_all_modals();

            load_submissions(false);
        })
        .catch((error) => document.getElementById("open_status").textContent = error)
        .finally(() => button.classList.remove("disabled-button"));
    button.classList.add("disabled-button");
}

export function on_submit(file_data: File) {
    source.submit(problem_link, file_data)
        .then(() => load_submissions(true));
}

export function load_submissions(notify: boolean) {
    if (submissions_timer != null) clearTimeout(submissions_timer);
    let submission_stubs = source.submissions(problem_link);

    submission_stubs.then((stubs) => {
        render_submission_stubs(stubs);
        if (stubs.length == 0) return;
        let latest_stub = stubs[0];

        if (latest_stub.score == null) {
            submissions_timer = setTimeout(load_submissions, SUBMISSION_TIMER_INTERVAL, notify);
        } else if (notify) {
            notify_submission(problem.name, latest_stub);
        }
    });
}

