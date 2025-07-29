export interface cloudUploadInterface{
    uploadMultiFiles(imageFiles:unknown[]):{url:string,id:string}[]
    uploadSingleFile(imageFile:unknown):{url:string,id:string}
    deleteImage(id:string):boolean
}