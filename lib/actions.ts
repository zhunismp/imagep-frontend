'use server'
import axios from "axios"
import { DownloadResponse, UploadResponse } from "./types"

const BASE_API = "https://imagep-api.zhunismp.dev/api/v1" // TODO: read from env
const api = axios.create({
    baseURL: BASE_API,
    // withCredentials: true,    
})

export async function upload(
    files: File[],
    taskId: string
): Promise<UploadResponse> {
    const form = new FormData()

    files.forEach((file) => {
        form.append("images", file)
    })

    console.log(taskId)

    const res = await api.post<UploadResponse>(`/upload/${taskId}`, form, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return res.data
}

export async function process(taskId: string): Promise<void> {
    await api.get(`/process/${taskId}`)
}

export async function download(taskId: string): Promise<DownloadResponse> {
    const res = await api.get(`/downloads/${taskId}`)
    console.log(res)
    return res.data
}