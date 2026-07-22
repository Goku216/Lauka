import apiClient from "./ApiConfig/apiClient";

export interface PresignedFileRequest {
  filename: string;
  content_type: string;
  size: number;
}

export interface PresignedFileResult {
  filename: string;
  object_key: string;
  upload_url: string;
  expires_in: number;
}

// Single-file presigned URL (used by Categories)
export const generateUploadUrl = async (
  payload: PresignedFileRequest
): Promise<PresignedFileResult> => {
  try {
    const response = await apiClient.post<any>(
      "/core/upload/generate-upload-url/",
      payload
    );
    return response.data; // adjust to `response` if apiClient already unwraps .data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail || "Failed to generate upload URL"
    );
  }
};

// Multi-file presigned URLs (used by Products: thumbnail + gallery)
export const generatePresignedUrls = async (
  files: PresignedFileRequest[]
): Promise<PresignedFileResult[]> => {
  try {
    const response = await apiClient.post<any>(
      "/core/upload/generate-presigned-urls/",
      { files }
    );
    return response.data; // adjust to `response` if apiClient already unwraps .data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail || "Failed to generate upload URLs"
    );
  }
};

// PUT a single file straight to R2 using its presigned URL.
// Uses raw fetch, not apiClient — the presigned URL is only signed for
// `content-type` + `host`, so no auth/baseURL headers should be attached.
export const uploadFileToR2 = async (
  uploadUrl: string,
  file: File | Blob,
  contentType: string
): Promise<void> => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image to storage");
  }
};

/**
 * Convenience helper: takes N files (in order), gets presigned URLs for all
 * of them in one call, uploads each in parallel, and returns their
 * object_keys in the SAME order as the input files array.
 */
export const uploadFilesToR2 = async (files: File[]): Promise<string[]> => {
  if (files.length === 0) return [];

  const presigned = await generatePresignedUrls(
    files.map((f) => ({
      filename: f.name,
      content_type: f.type,
      size: f.size,
    }))
  );

  // Match by index — response order mirrors request order.
  await Promise.all(
    files.map((file, i) => uploadFileToR2(presigned[i].upload_url, file, file.type))
  );

  return presigned.map((p) => p.object_key);
};