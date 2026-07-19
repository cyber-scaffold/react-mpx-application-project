import { IOCContainer } from "@/frameworks/react-ssr-tool-box/runtime/cores/IOCContainer";
import { HydrateResourceManagement } from "@/frameworks/react-ssr-tool-box/runtime/services/HydrateResourceManagement";

import type { HydrateCompileAssetsListQueryResult } from "@/frameworks/react-ssr-tool-box/runtime/services/HydrateResourceManagement";


/**
 * 获取注水物料资源的入口函数
 * **/
export async function getHydrateResource(alias: string): Promise<HydrateCompileAssetsListQueryResult> {
  const $HydrateResourceManagement = IOCContainer.get(HydrateResourceManagement);
  const compileAssetsInfo = await $HydrateResourceManagement.getResourceListByAlias(alias);
  if (!compileAssetsInfo) {
    return false;
  };
  return compileAssetsInfo;
};