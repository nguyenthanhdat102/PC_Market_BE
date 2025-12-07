import { crawlByPageParam } from "./strategies/crawlPageParam.js";

export async function crawlRetailer(page, retailerConfig) {
  const { pagination } = retailerConfig;
  switch (pagination.type) {
    case "page":
      return await crawlByPageParam(page, retailerConfig);
    default:
      throw new Error(
        `❌ Kiểu phân trang '${pagination.type}' chưa được hỗ trợ.`
      );
  }
}
