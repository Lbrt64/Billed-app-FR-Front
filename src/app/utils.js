// [Bug Hunt] - Bills
// using a file name, checks if the format is jpg, jpeg or png
export function isImage (filename) {
  const extension = filename.substring(filename.lastIndexOf('.') + 1)
  switch (extension.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
    case 'png':
      return true
  }
  return false
}
