import {Auxiliary, Problem} from "../../problem";
import * as utility from "../../utility";

const SECTIONS = ["STATEMENT", "INPUT", "OUTPUT", "HINT", "EXPLANATION", "SUBTASK", "CONSTRAINT"];

export function match_auxiliary(problem: Problem, container: HTMLElement) {
    let auxiliary: Auxiliary = new Auxiliary();
    let child_nodes = container.childNodes;
    auxiliary.input_method = child_nodes[utility.find_first_element(container, "Input") + 1].textContent;
    auxiliary.output_method = child_nodes[utility.find_first_element(container, "Output") + 1].textContent;
    auxiliary.memory_limit = child_nodes[utility.find_first_element(container, "Memory") + 1].textContent;
    auxiliary.time_limit = child_nodes[utility.find_first_element(container, "Time") + 1].textContent;
    problem.auxiliary = auxiliary;
}

export function match_sections(problem: Problem, statement_string: string) {
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

export function match_section(problem: Problem, current_section: string, segment: string) {
    if (current_section == SECTIONS[0]) problem.statement = segment;
    if (current_section == SECTIONS[1]) problem.input = segment;
    if (current_section == SECTIONS[2]) problem.output = segment;
    if (current_section == SECTIONS[3]) problem.hints = segment;
    if (current_section == SECTIONS[4]) problem.explanation = segment;
    if (current_section == SECTIONS[5]) problem.subtasks = segment;
    if (current_section == SECTIONS[6]) problem.constraints = segment;
}

export function match_samples(problem: Problem, document: Document) {
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

export function parse_sample_section(element: Element): string {
    let section = "";
    for (let span of element.getElementsByTagName("span")) {
        section += span.textContent.trim() + "\n";
    }
    return section;
}

