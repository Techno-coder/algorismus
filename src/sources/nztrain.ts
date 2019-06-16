import {Source} from "../source";
import {Auxiliary, Problem} from "../problem";
import * as utility from "../utility";
import * as katex from "katex";
import {resource_image} from "../request";

const DOMAIN_ROOT = "https://train.nzoi.org.nz";
const SECTIONS = ["STATEMENT", "INPUT", "OUTPUT", "HINT", "EXPLANATION", "SUBTASK", "CONSTRAINT"];

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
        space_sections(problem);

        return problem;
    }

    submit(base_link: string, file_data: string) {
        // TODO
    }
}

function match_auxiliary(problem: Problem, container: HTMLElement) {
    let auxiliary: Auxiliary = new Auxiliary();
    let child_nodes = container.childNodes;
    auxiliary.input_method = child_nodes[utility.find_first_element(container, "Input") + 1].textContent;
    auxiliary.output_method = child_nodes[utility.find_first_element(container, "Output") + 1].textContent;
    auxiliary.memory_limit = child_nodes[utility.find_first_element(container, "Memory") + 1].textContent;
    auxiliary.time_limit = child_nodes[utility.find_first_element(container, "Time") + 1].textContent;
    problem.auxiliary = auxiliary;
}

function match_sections(problem: Problem, statement_string: string) {
    let current_section = SECTIONS[0];
    let section_occurred = true;
    while (section_occurred) {
        section_occurred = false;

        let next_section = null;
        let best_segments = null;
        for (let section of SECTIONS) {
            let segments = statement_string.split(utility.match_heading_element(section));
            if (!best_segments || segments[0].length < best_segments[0].length) {
                best_segments = segments;
                next_section = section;
            }
        }

        if (best_segments.length >= 2) {
            statement_string = best_segments[1];
            section_occurred = true;
        }

        match_section(problem, current_section, best_segments[0]);
        current_section = next_section;
    }
}

function match_section(problem: Problem, current_section: string, segment: string) {
    if (current_section == SECTIONS[0]) problem.statement = segment;
    if (current_section == SECTIONS[1]) problem.input = segment;
    if (current_section == SECTIONS[2]) problem.output = segment;
    if (current_section == SECTIONS[3]) problem.hints = segment;
    if (current_section == SECTIONS[4]) problem.explanation = segment;
    if (current_section == SECTIONS[5]) problem.subtasks = segment;
    if (current_section == SECTIONS[6]) problem.constraints = segment;
}

function space_sections(problem: Problem) {
    problem.statement = utility.remove_last_break(problem.statement);
    problem.input = utility.remove_last_break(problem.input);
    problem.output = utility.remove_last_break(problem.output);
    problem.hints = utility.remove_last_break(problem.hints);
    problem.explanation = utility.remove_last_break(problem.explanation);
}

function match_samples(problem: Problem, document: Document) {
    let samples = document.getElementsByClassName("samples")[0];
    if (samples == null) return;

    problem.samples = [];
    for (let item of samples.getElementsByTagName("li")) {
        let input_section = item.getElementsByClassName("input")[0];
        let input = parse_sample_section(input_section);
        let output_section = item.getElementsByClassName("output")[0];
        let output = parse_sample_section(output_section);
        problem.samples.push({input: input.trim(), output: output.trim()});
    }
}

function parse_sample_section(element: Element): string {
    let section = "";
    for (let span of element.getElementsByTagName("span")) {
        section += span.textContent.trim() + "\n";
    }
    return section;
}
