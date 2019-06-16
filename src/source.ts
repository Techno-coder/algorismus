import {Problem} from "./problem";

export interface Source {
    process(document: Document): Problem;
    submit(base_link: string, file_data: File);
}
