export const readFileAsBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (ev: any) => resolve(ev.target.result);
    reader.readAsDataURL(file);
  });
};
