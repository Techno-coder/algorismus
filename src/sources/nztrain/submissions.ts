import {SubmissionStub} from "../../problem";
import {CORS_ROUTER, get_request_metadata} from "../../bypass";
import {DOMAIN_ROOT} from "./source";

export function submissions(base_link: string): Promise<SubmissionStub[]> {
    return fetch(CORS_ROUTER + base_link + "/submissions", get_request_metadata())
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.text();
        })
        .then((data) => {
            let parser = new DOMParser();
            let document = parser.parseFromString(data, "text/html");
            let submissions_table = document.getElementsByClassName("main_table")[0];
            return parse_submissions(submissions_table as HTMLTableElement);
        })
        .catch(() => []);
}

export function parse_submissions(submissions_table: HTMLTableElement): SubmissionStub[] {
    let stubs = [];
    let table_rows = submissions_table.tBodies[0].rows;

    for (let index = table_rows.length - 1; index >= 1; --index) {
        let table_row = table_rows[index] as HTMLTableRowElement;

        let stub = new SubmissionStub();
        let link_element = table_row.cells[1].childNodes[1] as HTMLAnchorElement;
        stub.link = DOMAIN_ROOT + link_element.getAttribute("href");
        stub.date = link_element.innerHTML;

        let score_element = table_row.cells[2] as HTMLTableDataCellElement;
        let score = parseInt(score_element.innerHTML);
        if (isNaN(score)) stub.score = null;
        else stub.score = score;

        stubs.push(stub);
    }
    return stubs;
}
