import fs from "fs";

export const deleteFile = async (filename: string) => {
  await fs.promises
    .stat(filename)
    .then(async () => {
      await fs.promises.unlink(filename);
    })
    .catch(() => {
      console.log("Nada encontrado");
    });
};
