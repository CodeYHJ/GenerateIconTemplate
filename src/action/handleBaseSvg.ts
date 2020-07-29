import { fstat } from "fs";

import fs from "fs";
import path from "path";
import { createTemplateStr, generateExport, generateVar, generateTemplateSvg } from "./create";
const sourceSvgPath = path.resolve(__dirname, '../sourceSvg/iconfont.svg')
const cachSvgPath = path.resolve(__dirname, '../cachSvg/index.json')

const glyphList = (str: string) => {
    const glyPhArray = []
    const strArrary = str.matchAll(/\<glyph\s.*\/\>$/gm)
    for (const item of strArrary) {
        const svg = item[0]
        glyPhArray.push(item[0])
    }
    return glyPhArray
}
const filter = (str: string) => {
    const nameMatch = str.match(/glyph\-name\=\"(\w|\-)*\"\s/g)
    const dMatch = str.match(/d\=\"(\w|\s|\.|\-)*\"/g)
    const name = nameMatch ? nameMatch[0] : ''
    const d = dMatch ? dMatch[0] : ''
    return { name: name.split('=')[1], d: d.split('=')[1] }
}
const getRootPath = () => path.resolve(__dirname, '../../')
const hasFileOrDir = (path: string) => {
    try {
        fs.accessSync(path, fs.constants.F_OK);
        return true
    } catch (error) {
        return false

    }
}
const mkdir = (path: string) => {
    if (!hasFileOrDir(path)) {
        fs.mkdirSync(path)
    }
}
const mkdirFile = (path: string, str: string) => {
    if (!hasFileOrDir(path)) {
        fs.writeFileSync(path, str)
    }
}
const transformName = (name: string) => {
    const nameList = [];

    let upCase = false
    // 大小写转化
    const cachName = 'icon-' + name.replace(/\"/g, '')
    for (let i of cachName) {
        if (upCase) {
            nameList.push(i.toUpperCase())
            upCase = false
            continue;
        }
        if (i === '-') {
            upCase = true
            continue;
        }
        nameList.push(i)
    }
    nameList[0] = nameList[0].toUpperCase()
    return nameList.join('')
}
const createComponent = (iconPath: string, iconName: string, svgName: string) => {
    mkdir(iconPath)
    const str = createTemplateStr(iconName, svgName)
    const filePath = path.join(iconPath, 'index.tsx')
    mkdirFile(filePath, str)

}
const addStrInFile = (path: string, componentName: string, dirName: string) => {
    const str = generateExport(componentName, dirName)
    fs.appendFileSync(path, str)
}
export const run = () => {
    const str = fs.readFileSync(sourceSvgPath, { encoding: "utf-8" })
    const glyphArry = glyphList(str)
    const rootPath = getRootPath()
    const componentPath = path.join(rootPath, 'component')
    const svgPath = path.join(rootPath, 'svg')
    const svgFillPath = path.join(rootPath, 'svg/fill')
    const svgOutlinedPath = path.join(rootPath, 'svg/outlined')


    const exportPath = path.join(rootPath, 'component/index.tsx')
    // 创建component文件夹
    mkdir(componentPath)
    // svg
    mkdir(svgPath)
    mkdir(svgFillPath)
    mkdir(svgOutlinedPath)



    glyphArry.forEach(el => {
        const { name, d } = filter(el)
        let iconName = transformName(name)
        const iconPath = path.join(componentPath, iconName)
        // 创建各svg组件文件夹与文件
        createComponent(iconPath, iconName, name)
        // 引入导出文件
        const componentName = generateVar(iconName)
        addStrInFile(exportPath, componentName, iconName)
        // 生成svg文件
        const svgFileStr = generateTemplateSvg(d);
        const svgFileName = name.replace(/\"/g, "").trim() + '.svg'
        let svgItemPath=''
        if (svgFileName.endsWith('-fill.svg')) {
             svgItemPath = path.join(svgFillPath, svgFileName)
        } else {
             svgItemPath = path.join(svgOutlinedPath, svgFileName)
        }
        mkdirFile(svgItemPath, svgFileStr)

    })

    // const strObj = { a: writeStr }
    // fs.writeFileSync(cachSvgPath, JSON.stringify(strObj))


}