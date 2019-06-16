export function remove_elements_by_class(document: Element, class_name: string) {
    remove_elements(document.getElementsByClassName(class_name));
}

export function remove_elements_by_tag(document: Element, tag: string) {
    remove_elements(document.getElementsByTagName(tag));
}

export function remove_elements(elements: HTMLCollectionOf<Element>) {
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

export function match_heading_element(content: string): RegExp {
    return new RegExp(`<h[^<]+>[^<]*${content}[^>]*<\\/[^>]+>`, "i");
}

export function find_first_element(container: HTMLElement, content: string): number {
    for (let [index, element] of container.childNodes.entries()) {
        if (element.textContent.indexOf(content) != -1) {
            return index;
        }
    }
    return -1;
}

export function space_paragraphs(container: Element) {
    let paragraphs = container.getElementsByTagName("p");
    for (let element of paragraphs) {
        element.outerHTML += "<br>";
    }
}

export function remove_last_break(content?: string): string | null {
    if (content == null) return null;
    let index = content.lastIndexOf("<br>");
    if (index != -1) return content.substring(0, index);
    return content;
}

export function set_resource_links(document: Element, root: string) {
    set_resource_type(document, root, "img", "src");
    set_resource_type(document, root, "a", "href");
    expand_anchor_links(document);
}

export function set_resource_type(document: Element, root: string, tag: string, attribute: string) {
    let elements = document.getElementsByTagName(tag);
    for (let element of elements) {
        let canonical_link = element.getAttribute(attribute);
        if (canonical_link.startsWith('/')) {
            canonical_link = root + canonical_link;
        }
        element.setAttribute(attribute, canonical_link);
    }
}

export function expand_anchor_links(document: Element) {
    let elements = document.getElementsByTagName("a");
    for (let element of elements) {
        element.setAttribute("target", "_blank");
    }
}
