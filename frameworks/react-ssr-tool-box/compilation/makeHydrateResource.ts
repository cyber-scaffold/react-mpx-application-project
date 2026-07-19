import { IOCContainer } from "@/frameworks/react-ssr-tool-box/compilation/cores/IOCContainer";
import { MakeHydrateResource } from "@/frameworks/react-ssr-tool-box/compilation/actions/MakeHydrateResource";

export type makeHydrateResourceParamsType = {
  /** 运行模式 **/
  mode: "development" | "production" | "none"
  /** 是否使用watch模式监听文件的改变 **/
  watch: boolean
};

/**
 * 编译注水物料的入口函数
 * **/
export async function makeHydrateResource(params: makeHydrateResourceParamsType) {
  const $MakeHydrateResource = IOCContainer.get(MakeHydrateResource);
  if (params.mode === "development") {
    await $MakeHydrateResource.checkSourceCodeAndTransformer();
    await $MakeHydrateResource.makeResourceWithWatchMode();
  };
  if (params.mode === "production") {
    await $MakeHydrateResource.checkSourceCodeAndTransformer();
    await $MakeHydrateResource.makeResourceWithBuildMode();
  };
};