/**
 * 工程脚本编译和制作物料阶段使用的方法
 * **/
export { setCompileConfiguration } from "@/frameworks/react-ssr-tool-box/compilation/setCompileConfiguration";
export { makeDehydrateResource } from "@/frameworks/react-ssr-tool-box/compilation/makeDehydrateResource";
export { makeHydrateResource } from "@/frameworks/react-ssr-tool-box/compilation/makeHydrateResource";

export type { MaterielCompilationInfoType, CompilationConfigType, CustmerInputCompilationConfigType, MaterielPairsType, PresetPairsType } from "@/frameworks/react-ssr-tool-box/compilation/commons/CompilationConfigManager";
export type { CompileAssetsDictionaryType } from "@/frameworks/react-ssr-tool-box/public/ResourceManager.d";