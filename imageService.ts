export interface ImageService { fileToDataUrl(file: File): Promise<string>; }
export class LocalImageService implements ImageService {
  fileToDataUrl(file: File) { return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file); }); }
}
// TODO V2.2: implement Firebase Storage behind this interface.
export const imageService: ImageService = new LocalImageService();
