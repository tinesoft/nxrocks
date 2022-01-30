import { create, builder, fragment } from 'xmlbuilder2';
import { XMLBuilder } from 'xmlbuilder2/lib/interfaces';
import { select, SelectedValue } from 'xpath';

export class XmlBuilder  {

    constructor(private xmlBuilder: XMLBuilder) {}

    public addNode(node: string, content?: string, attributes?: { [key: string]: any }) {
        let result = this.xmlBuilder.ele(node, attributes);
        if (content) {
            result = result.txt(content);
        }
    
        return result;
    }

    public build(): XMLBuilder {
        return this.xmlBuilder;
    }
}

export function readXml(xmlContent: string, ignoreNamespace = true): XMLBuilder {
    return create(ignoreNamespace ? {
        defaultNamespace: {
            ele: null,
            att: null
        }
    } : {}, xmlContent);
}

export function findXmlNodes(xml: XMLBuilder, xpath: string, ignoreNamespace = true) {
    let realXpath = xpath;
    if (ignoreNamespace) {
        const prefix = xpath.startsWith('//') ? '//' : '/';
        realXpath = prefix + xpath.split('/')
            .filter(p => p.length > 0)
            .map(p => p.trim().replace(/^(\w+)(?:\[[^]+\])?$/, `*[local-name() = '$1']`))
            .join('/');
    }

    return select(realXpath, asXmlNode(xml));
}

export function findXmlNode(xml: XMLBuilder, xpath: string, ignoreNamespace = true): SelectedValue | undefined {
    return findXmlNodes(xml, xpath, ignoreNamespace)?.[0];
}


export function findXmlNodeContent(xml: XMLBuilder, xpath: string, ignoreNamespace = true): string | undefined {

    const node = findXmlNode(xml, xpath, ignoreNamespace);
    if (isNode(node)) {
        return node.textContent;
    }
    return node?.toString();
}

export function findXmlMatching(xml: XMLBuilder, xpath: string, ignoreNamespace = true) {
    const node = findXmlNode(xml, xpath, ignoreNamespace);

    if (node) {
        return builder(ignoreNamespace ?{
            defaultNamespace: {
                ele: null,
                att: null
            }
        }: {}, node as any);
    }
    return null;
}

export function newXmlNode(content: { [key: string]: any } | string): XMLBuilder {
    return create(content);
}

export function addXmlNode(target: XMLBuilder, node: { [key: string]: any } | string) {
    return target.import(newXmlNode(node));
}

function asXmlNode(xml: XMLBuilder): Node {
    return xml.node as unknown as Node;
}

function isNode(value: SelectedValue): value is Node {
    return (<Node>value)?.nodeType !== undefined;
}