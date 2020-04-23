import {Source} from "../../source";
import {Problem, Submission, SubmissionStub} from "../../problem";
import {resource_image} from "../../bypass";
import * as utility from "../../utility";
import * as katex from "katex";
import {post_submission} from "../../submit";
import {match_auxiliary, match_samples, match_sections} from "./functions";
import {submissions} from "./submissions";

export const DOMAIN_ROOT = "https://train.nzoi.org.nz";

const LANGUAGE_OPTION_CPLUSPLUS = "11";

export class NZTrain implements Source {
    process(document: Document): Problem {
        let main_container: HTMLElement = document.getElementById("main-container");
        let statement = main_container.getElementsByClassName("statement")[0];
        utility.remove_elements_by_class(statement, "js_only");
        utility.remove_elements_by_tag(statement, "script");
        utility.space_paragraphs(statement);
        utility.set_resource_links(statement, DOMAIN_ROOT);

        let image_elements = statement.getElementsByTagName("img");
        for (let index = 0; index < image_elements.length; ++index) {
            image_elements[index].id = `image-${index}`;
            resource_image(image_elements[index] as HTMLImageElement);
        }

        let code_elements = statement.getElementsByTagName("code");
        for (let element of code_elements) {
            element.classList.add("language-none");
        }

        let mathematical_elements = statement.getElementsByTagName("noscript");
        while (mathematical_elements.length > 0) {
            let element = mathematical_elements[0];
            let enclosing_element = element.parentElement;
            enclosing_element.outerHTML = katex.renderToString(element.textContent, {throwOnError: false});
        }

        let problem: Problem = new Problem();
        let title_box_elements = document.getElementById("main-page-title-box").childNodes;
        problem.name = title_box_elements[title_box_elements.length - 2].textContent;

        match_auxiliary(problem, main_container);
        match_sections(problem, statement.innerHTML);
        match_samples(problem, document);

        return problem;
    }

    submit(base_link: string, file_data: File): Promise<void> {
        let form_data = new FormData();
        form_data.set("submission[language_id]", LANGUAGE_OPTION_CPLUSPLUS);
        form_data.set("submission[source_file]", file_data);
        return post_submission(base_link + "/submit", form_data);
    }

    submissions(base_link: string): Promise<SubmissionStub[]> {
        return submissions(base_link);
    }
}
