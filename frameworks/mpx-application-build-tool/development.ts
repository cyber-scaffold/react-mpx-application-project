#!/usr/bin/env node
import { IOCContainer } from "@/frameworks/mpx-application-build-tool/cores/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/mpx-application-build-tool/commons/FrameworkConfigManager";

// import { MakePublicDLLFile } from "@/frameworks/mpa-application-build-tool/actions/MakePublicDLLFile";
import { MakeMaterielResource } from "@/frameworks/mpx-application-build-tool/actions/MakeMaterielResource";
import { MakeServerApplication } from "@/frameworks/mpx-application-build-tool/actions/MakeServerApplication";
import { CompilerActionService } from "@/frameworks/mpx-application-build-tool/services/CompilerActionService";

setImmediate(async () => {
  try {
    await IOCContainer.get(FrameworkConfigManager).initialize();
    await IOCContainer.get(CompilerActionService).cleanDestnation();
    /** 编译DLL文件 **/
    // await IOCContainer.get(MakePublicDLLFile).execute();
    /** 开发模式SSR物料编译 **/
    await IOCContainer.get(MakeMaterielResource).buildMaterielResourceByDevelopmentAndWatch();
    /** 开发模式Express主服务应用编译 **/
    await IOCContainer.get(MakeServerApplication).bootstrapByDevelopmentMode();
  } catch (error) {
    console.log("error", error);
    process.exit(0);
  };
});