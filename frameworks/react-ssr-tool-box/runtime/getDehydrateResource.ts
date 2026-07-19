import { IOCContainer } from "@/frameworks/react-ssr-tool-box/runtime/cores/IOCContainer";
import { DehydrateResourceManagement } from "@/frameworks/react-ssr-tool-box/runtime/services/DehydrateResourceManagement";

import type { DehydrateCompileAssetsListQueryResult } from "@/frameworks/react-ssr-tool-box/runtime/services/DehydrateResourceManagement";


/**
 * 获取脱水物料资源的入口函数
 * **/
export async function getDehydrateResource(alias: string): Promise<DehydrateCompileAssetsListQueryResult> {
  const $DehydrateResourceManagement = IOCContainer.get(DehydrateResourceManagement);
  const compileAssetsInfo = await $DehydrateResourceManagement.getResourceListByAlias(alias);
  if (!compileAssetsInfo) {
    return false;
  }
  return compileAssetsInfo;
};