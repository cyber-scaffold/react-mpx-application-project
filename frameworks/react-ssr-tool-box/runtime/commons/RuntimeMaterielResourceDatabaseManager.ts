import path from "path";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/react-ssr-tool-box/runtime/cores/IOCContainer";
import { RuntimeConfigManager } from "@/frameworks/react-ssr-tool-box/runtime/commons/RuntimeConfigManager";

import type { SummaryDatabaseDictionaryType, ResourceDatabaseDictionaryType } from "@/frameworks/react-ssr-tool-box/public/ResourceManager.d";

@injectable()
export class RuntimeMaterielResourceDatabaseManager {

  private summaryDatabase: Low<SummaryDatabaseDictionaryType>;

  private hydrateCompileDatabase: Low<ResourceDatabaseDictionaryType>;

  private dehydrateCompileDatabase: Low<ResourceDatabaseDictionaryType>;

  constructor (
    @inject(RuntimeConfigManager) private readonly $RuntimeConfigManager: RuntimeConfigManager
  ) { };

  public async initialize() {
    try {
      const { assetsDirectoryPath } = await this.$RuntimeConfigManager.getRuntimeConfig();
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

IOCContainer.bind(RuntimeMaterielResourceDatabaseManager).toSelf().inSingletonScope();