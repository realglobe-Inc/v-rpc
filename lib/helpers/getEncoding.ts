const SupportedContentTypes = {
  BINARY: 'application/octet-stream',
  JSON: 'application/json',
  TEXT: 'text/plain',
}

export const getEncoding = (contentTypeString: string) => {
  const [contentType, parameter] = contentTypeString
    .toLowerCase()
    .split(';')
    .map((s) => s.trim())

  if (!Object.values(SupportedContentTypes).includes(contentType)) {
    return null
  }

  const encoding = (() => {
    if (
      contentType === SupportedContentTypes.TEXT ||
      contentType === SupportedContentTypes.JSON
    ) {
      if (parameter && parameter.includes('charset=')) {
        const charset = parameter.match(/charset=([A-Za-z0-9_-]+)/)![1]
        return charset
      } else {
        return 'utf-8'
      }
    } else {
      return null
    }
  })()
  return {
    contentType,
    encoding,
  }
}
