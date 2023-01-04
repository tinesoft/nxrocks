import { create, builder, fragment } from 'xmlbuilder2';
import { XMLBuilder } from 'xmlbuilder2/lib/interfaces';
import { select, SelectedValue } from 'xpath';


export function readXml(xmlContent: string, ignoreNamespace = true): XMLBuilder {

    if(!xmlContent) {
        throw new Error('Cannot read XML, provided content is empty');
    }

    return create(ignoreNamespace ? {
        defaultNamespace: {
            ele: null,
            att: null
        }
    } : {}, xmlContent);
}

export function findXmlNodes(xml: XMLBuilder, xpath: string, ignoreNamespace = true): SelectedValue[] | undefined {
    let realXpath = xpath;
    if (ignoreNamespace) {
        const prefix = xpath.startsWith('//') ? '//' : '/';
        realXpath = prefix + xpath.split('/')
            .filter(p => p.length > 0)
            .map(p => p.trim().replace(/^(\w+)(?:\[[^]+\])?$/, `*[local-name(.) = '$1']`))
            .join('/');
    }

    return select(realXpath, asXmlNode(xml));
}

export function findXmlNode(xml: XMLBuilder, xpath: string, ignoreNamespace = true): SelectedValue | undefined {
    return findXmlNodes(xml, xpath, ignoreNamespace)?.[0];
}

export function findNodeContent(source: SelectedValue , xpath: string, ignoreNamespace = true): string | undefined {

    return findXmlContent(asNewXMLBuilder(source as Node), xpath, ignoreNamespace);
}

export function findXmlContent(xml: XMLBuilder, xpath: string, ignoreNamespace = true): string | undefined {

    const node = findXmlNode(xml, xpath, ignoreNamespace);
    if (isNode(node)) {
        return node.textContent;
    }
    return node?.toString();
}

export function hasXmlMatching(xml: XMLBuilder, xpath: string, ignoreNamespace = true) : boolean {
    const result = findXmlNodes(xml, xpath, ignoreNamespace);
    return result?.length > 0;
}

export function findXmlMatching(xml: XMLBuilder, xpath: string, ignoreNamespace = true) : XMLBuilder | null {
    const value = findXmlNode(xml, xpath, ignoreNamespace);

    if (value) {
        return asXMLBuilder(value as Node,ignoreNamespace);
    }
    return null;
}

export function newXmlNode(content: { [key: string]: any } | string): XMLBuilder {
    return create(content);
}

export function addXmlNode(target: XMLBuilder, node: { [key: string]: any } | string): XMLBuilder {
    const child = newXmlNode(node);
    return target.import(child);
}

export function removeXmlNode(nodeToRemove: XMLBuilder): XMLBuilder {
    return nodeToRemove.remove();
}

export function addXmlElement(target: XMLBuilder, ...elements: (string | {name: string, attributes?:  {[key: string]: any} })[]) {
    let result = target;

    elements.forEach( elm => {
       result =  (typeof elm === 'string') ? result.ele(elm) : result.ele(elm.name, elm.attributes);
    });
    return result;
}

export function isXmlNodeEmpty(xml: XMLBuilder): boolean {
    try {
        return !!xml.first();
    } catch (error) {
        return true;
    }
}

function asNewXMLBuilder(node: Node, ignoreNamespace = true): XMLBuilder {
    return readXml(builder(node as any).toString(),ignoreNamespace);
}

function asXMLBuilder(node: Node, ignoreNamespace = true): XMLBuilder {
    return builder(ignoreNamespace ?{
        defaultNamespace: {
            ele: null,
            att: null
        }
    }: {}, node as any);
}

function asXmlNode(xml: XMLBuilder): Node {
    return xml.node as unknown as Node;
}

function isNode(value: SelectedValue): value is Node {
    return (<Node>value)?.nodeType !== undefined;
}
