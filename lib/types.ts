export type UploadRequest = {
    files: File[];
}

type UploadFileResult = {
    fileId: string,
    filename: string,
    serverFilename: string,
    errMsg: string,
}

export type UploadResponse = {
    taskId: string,
    uploaded: UploadFileResult[],
    failed: UploadFileResult[],
}

type Progress = {
    total: number,
    completed: number,
    failed: number,
}

type FileResult = {
    fileId: string,
    serverFilename: string,
    filename: string,
    signedUrl: string,
}

export type DownloadResponse = {
    taskId: string,
    progress: Progress,
    completed: FileResult[],
    failed: FileResult[],
    isCompleted: boolean,
    next?: number,
}