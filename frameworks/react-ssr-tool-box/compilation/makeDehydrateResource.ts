import { IOCContainer } from "@/frameworks/react-ssr-tool-box/compilation/cores/IOCContainer";
import { MakeDehydrateResource } from "@/frameworks/react-ssr-tool-box/compilation/actions/MakeDehydrateResource";

export type makeDehydrateResourceParamsType = {
  /** 运行模式 **/
  mode: "development" | "production" | "none"
  /** 是否使用watch模式监听文件的改变 **/
  watch: boolean
};

/**
 * 编译脱水物料的入口函数
 * **/
export async function makeDehydrateResource(params: makeDehydrateResourceParamsType) {
  const $MakeDehydrateResource = IOCContainer.get(MakeDehydrateResource);
  if (params.mode === "development") {
    await $MakeDehydrateResource.checkSourceCodeAndTransformer();
    await $MakeDehydrateResource.makeResourceWithWatchMode();
  };
  if (params.mode === "production") {
    await $MakeDehydrateResource.checkSourceCodeAndTransformer();
    await $MakeDehydrateResource.makeResourceWithBuildMode();
  };
};