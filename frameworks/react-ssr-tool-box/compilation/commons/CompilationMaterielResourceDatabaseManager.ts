import path from "path";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/react-ssr-tool-box/compilation/cores/IOCContainer";
import { CompilationConfigManager } from "@/frameworks/react-ssr-tool-box/compilation/commons/CompilationConfigManager";

import type { SummaryDatabaseDictionaryType, ResourceDatabaseDictionaryType } from "@/frameworks/react-ssr-tool-box/public/ResourceManager.d";

@injectable()
export class CompilationMaterielResourceDatabaseManager {

  private summaryDatabase: Low<SummaryDatabaseDictionaryType>;

  private hydrateCompileDatabase: Low<ResourceDatabaseDictionaryType>;

  private dehydrateCompileDatabase: Low<ResourceDatabaseDictionaryType>;

  constructor (
    @inject(CompilationConfigManager) private readonly $CompilationConfigManager: CompilationConfigManager
  ) { };

  public async initialize() {
    try {
      const { assetsDirectoryPath } = await this.$CompilationConfigManager.getRuntimeConfig();
      this.summaryDatabase = new Low(new JSONFile(path.resolve(assetsDirectoryPath, "./summary.json")), {});
      this.hydrateCompileDatabase = new Low(new JSONFile(path.resolve(assetsDirectoryPath, "./hydrate-compile.json")), {});
      this.dehydrateCompileDatabase = new Low(new JSONFile(path.resolve(assetsDirectoryPath, "./dehydrate-compile.json")), {});
    } catch (error) {
      throw error;
    };
  };

  public getSummaryDatabase(): Low<SummaryDatabaseDictionaryType> {
    return this.summaryDatabase;
  };

  public getHydrateCompileDatabase(): Low<ResourceDatabaseDictionaryType> {
    return this.hydrateCompileDatabase;
  };

  public getDehydrateCompileDatabase(): Low<ResourceDatabaseDictionaryType> {
    return this.dehydrateCompileDatabase;
  };

};

IOCContainer.bind(CompilationMaterielResourceDatabaseManager).toSelf().inSingletonScope();