export const generateVar = (name: string) => {
    const splitName = name.split('')
    splitName[0] = splitName[0].toUpperCase()
    return splitName.join('').trim()

}

export const generateTemplateStr = (tyName: string, componentName: string, svgName: string) => {

    return "import React from 'react';" +
        "\n" +
        "import Icon from '../../Icon';" +
        "\n" +
        `export interface ${tyName}Props {className?:String}` +
        "\n" +
        `const ${componentName}: React.SFC<${tyName}Props> = (props) => {` +
        "\n" +
        "const {clasName}=props" +
        "\n" +
        " const cls = className ? className : '';" +
        "\n" +
        "return ( " +
        "\n" +
        `<Icon type={${svgName}} className={cls}/>` +
        "\n" +
        ");" +
        "\n" +
        "}" +
        "\n" +
        `export default ${componentName};`
}
export const generateExport = (componentName: string, dirName: string) => {
    return `export { default as ${componentName} } from "./${dirName}" \n `
}
export const createTemplateStr = (name: string, svgName: string) => {
    const componentName = generateVar(name)

    return generateTemplateStr(componentName, componentName, svgName)
}
export const generateTemplateSvg = (d: string) => {
    return `<?xml version="1.0" standalone="no"?><svg  class="icon" viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg" width="200" height="200">
    <defs>
        <style type="text/css"></style>
    </defs>
    <path d=${d}></path></svg>`
}