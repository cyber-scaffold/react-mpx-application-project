import path from "path";
import { injectable } from "inversify";

import { IOCContainer } from "@/frameworks/react-ssr-tool-box/compilation/cores/IOCContainer";
import { materielsConfigTransformer } from "@/frameworks/react-ssr-tool-box/compilation/utils/materielsConfigTransformer";

import type { MaterielInfoByAliasDictionaryType } from "@/frameworks/react-ssr-tool-box/compilation/utils/materielsConfigTransformer";

export type MaterielPairsType = [alias: string, detail: MaterielCompilationInfoType][];

export type PresetPairsType = [virtualModuleName: string, virtualModuleContent: string][];

export type MaterielRenderType = {
  hydrate: boolean
  dehydrate: boolean
};

export type MaterielDetailInfoType = {
  alias: string
  source: string
};

export type MaterielCompilationInfoType = MaterielRenderType & MaterielDetailInfoType;

export interface CompilationConfigType {
  projectDirectoryPath: string
  assetsDirectoryPath: string
  extractResourceDirectoryName: string
  extractResourceDirectoryPath: string
  hydrateResourceDirectoryName: string
  hydrateResourceDirectoryPath: string
  hydrateDictionary: MaterielInfoByAliasDictionaryType
  dehydrateDictionary: MaterielInfoByAliasDictionaryType
  dehydrateResourceDirectoryName: string
  dehydrateResourceDirectoryPath: string
  dehydrateIncludePackageList?: string[]
  dehydrateExcludePackageList?: string[]
  dehydratePreset: (materielPairs: MaterielPairsType) => Promise<PresetPairsType>
  hydratePreset: (materielPairs: MaterielPairsType) => Promise<PresetPairsType>
  materielArrayList: MaterielCompilationInfoType[]
};

export interface CustmerInputCompilationConfigType {
  projectDirectoryPath?: string
  assetsDirectoryName?: string
  extractResourceDirectoryName?: string
  hydrateResourceDirectoryName?: string
  dehydrateResourceDirectoryName?: string
  dehydrateIncludePackageList?: string[]
  dehydrateExcludePackageList?: string[]
  dehydratePreset: (materielPairs: MaterielPairsType) => Promise<PresetPairsType>
  hydratePreset: (materielPairs: MaterielPairsType) => Promise<PresetPairsType>
  materiels?: MaterielCompilationInfoType[]
};

/** 
 * 制作物料阶段的框架配置
 * **/
@injectable()
export class CompilationConfigManager {

  /** 项目的根目录 **/
  private projectDirectoryPath = process.cwd();

  /** 物料资产的目录 **/
  private assetsDirectoryName = "dist";

  /** 物料资产输出的目录(根据 项目的根目录 和 物料资产的目录 计算得到) **/
  private getAssetsDirectoryPath() {
    return path.resolve(this.projectDirectoryPath, this.assetsDirectoryName);
  };

  /** 文件资源的输出位置对应的文件夹名称 **/
  private extractResourceDirectoryName = "extract";

  /** 文件资源的输出位置(服务端ssr渲染函数)(根据 物料资产的目录 和 对应文件夹名称 计算得到) **/
  private getExtractResourceDirectoryPath() {
    return path.resolve(this.getAssetsDirectoryPath(), this.extractResourceDirectoryName);
  };

  /** 脱水资源的输出位置对应的文件夹名称 **/
  private dehydrateResourceDirectoryName = "dehydrate";

  /** 脱水资源的输出位置(服务端ssr渲染函数)(根据 物料资产的目录 和 对应文件夹名称 计算得到) **/
  private getDehydrateResourceDirectoryPath() {
    return path.resolve(this.getAssetsDirectoryPath(), this.dehydrateResourceDirectoryName);
  };

  /** 注水资源的输出位置对应的文件夹名称 **/
  private hydrateResourceDirectoryName = "hydrate";

  /** 注水资源的输出位置(前端javascript和css)(根据 物料资产的目录 和 对应文件夹名称 计算得到) **/
  private getHydrateResourceDirectoryPath() {
    return path.resolve(this.getAssetsDirectoryPath(), this.hydrateResourceDirectoryName);
  };

  /**
   * 数组形式的物料清单信息(用于计算的重要属性,修改后影响大)
   * **/
  private materielArrayList: MaterielCompilationInfoType[];

  /**
   * 需要编译的注水物料的字典
   * **/
  private hydrateDictionary: MaterielInfoByAliasDictionaryType;

  /**
   * 需要编译的脱水物料的字典
   * **/
  private dehydrateDictionary: MaterielInfoByAliasDictionaryType;

  /**
   * 针对脱水物料的优化
   * 从项目的配置文件中获取到必须需要被打包的模块信息
   * 只所以要这么做是因为如果全部模块都被排除的话在引用.css这类文件的时候会被翻译成require("<filename>.css")就会导致样式表编译失败
   * 所以通常情况下 组件库 这类包含静态资源编译的依赖需要被打包
   * 所以需要在项目文件中手动指定一下,避免出现错误
   * **/
  private dehydrateIncludePackageList: string[] = [];


  /**
   * 针对脱水物料的优化
   * 从项目的配置文件中获取到必须需要被排除的模块信息
   * 因为@ant-design/cssinjs这类库是包含在antd中的
   * 如果antd被上面的includePackageList包含了的话就意味着这个@ant-design/cssinjs也会被包含
   * 但是我们却不希望把@ant-design/cssinjs包含进去所以需要在这里再次排除
   * **/
  private dehydrateExcludePackageList: string[] = [];

  private dehydratePreset: (materielPairs: MaterielPairsType) => Promise<PresetPairsType>;

  private hydratePreset: (materielPairs: MaterielPairsType) => Promise<PresetPairsType>;

  /** 基于用户的配置合并覆盖掉原来的属性然后重新计算一遍 **/
  public async initialize(inputCustmerConfig: CustmerInputCompilationConfigType) {
    if (!inputCustmerConfig) {
      return false;
    };
    if (inputCustmerConfig.projectDirectoryPath) {
      this.projectDirectoryPath = inputCustmerConfig.projectDirectoryPath;
    };
    if (inputCustmerConfig.assetsDirectoryName) {
      this.assetsDirectoryName = inputCustmerConfig.assetsDirectoryName;
    };
    if (inputCustmerConfig.hydrateResourceDirectoryName) {
      this.hydrateResourceDirectoryName = inputCustmerConfig.hydrateResourceDirectoryName;
    };
    if (inputCustmerConfig.dehydrateResourceDirectoryName) {
      this.dehydrateResourceDirectoryName = inputCustmerConfig.dehydrateResourceDirectoryName;
    };
    if (inputCustmerConfig.dehydrateIncludePackageList) {
      this.dehydrateIncludePackageList = inputCustmerConfig.dehydrateIncludePackageList;
    };
    if (inputCustmerConfig.dehydrateExcludePackageList) {
      this.dehydrateExcludePackageList = inputCustmerConfig.dehydrateExcludePackageList;
    };
    if (inputCustmerConfig.dehydratePreset) {
      this.dehydratePreset = inputCustmerConfig.dehydratePreset;
    };
    if (inputCustmerConfig.hydratePreset) {
      this.hydratePreset = inputCustmerConfig.hydratePreset;
    };
    if (inputCustmerConfig.materiels) {
      const { hydrate, dehydrate } = materielsConfigTransformer(inputCustmerConfig.materiels);
      this.dehydrateDictionary = dehydrate;
      this.hydrateDictionary = hydrate;
      this.materielArrayList = inputCustmerConfig.materiels;
    };
  };

  /** 获取最终组合之后的运行时配置 **/
  public getRuntimeConfig(): CompilationConfigType {
    return {
      projectDirectoryPath: this.projectDirectoryPath,
      assetsDirectoryPath: this.getAssetsDirectoryPath(),
      extractResourceDirectoryName: this.extractResourceDirectoryName,
      extractResourceDirectoryPath: this.getExtractResourceDirectoryPath(),
      hydrateResourceDirectoryName: this.hydrateResourceDirectoryName,
      hydrateResourceDirectoryPath: this.getHydrateResourceDirectoryPath(),
      dehydrateResourceDirectoryName: this.dehydrateResourceDirectoryName,
      dehydrateResourceDirectoryPath: this.getDehydrateResourceDirectoryPath(),
      dehydrateIncludePackageList: this.dehydrateIncludePackageList,
      dehydrateExcludePackageList: this.dehydrateExcludePackageList,
      dehydrateDictionary: this.dehydrateDictionary,
      hydrateDictionary: this.hydrateDictionary,
      dehydratePreset: this.dehydratePreset,
      hydratePreset: this.hydratePreset,
      materielArrayList: this.materielArrayList
    };
  };

};

IOCContainer.bind(CompilationConfigManager).toSelf().inSingletonScope();