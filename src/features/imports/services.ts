import { apiClient } from "@/lib/axios";
import { API_ENDPOINT } from "@/shared/constants/apiEndpoint";

export interface ImportImageResult {
  message?: string;
  fileName?: string;
  originalFileName?: string;
  ocrResult?: {
    isSuccess?: boolean;
    text?: string | null;
    errorMessage?: string | null;
  };
  rawOcrJson?: string | null;
}

export const importService = {
  async uploadReceiptImage(
    file: File,
    options?: { layout?: string; runOcr?: boolean },
  ): Promise<ImportImageResult> {
    const fd = new FormData();
    fd.append("file", file);
    if (options?.layout != null) {
      fd.append("layout", options.layout);
    }
    fd.append("runOcr", String(options?.runOcr ?? true));
    return (await apiClient.post(API_ENDPOINT.IMPORTS.IMAGE, fd)) as ImportImageResult;
  },
};
