import {Problem, SubmissionStub} from "./problem";

export interface Source {
    process(document: Document): Problem;

    submit(base_link: string, file_data: File): Promise<void>;

    submissions(base_link: string): Promise<SubmissionStub[]>;
}
