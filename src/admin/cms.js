const parseYouTubeID = idOrUrl =>
  idOrUrl.indexOf('watch?v=') !== -1
    ? idOrUrl.split('watch?v=')[1].replace(/&.*/, '')
    : idOrUrl

const youTube = {
  id: 'youtube',
  label: 'YouTube',
  fields: [{ name: 'id', label: 'YouTube Video ID or URL', widget: 'string' }],
  pattern: /^\[\[youtube:(\S+)\]\]$/,
  fromBlock: match => ({ id: match[1] }),
  toBlock: ({ id }) => `[[youtube:${parseYouTubeID(id)}]]`,
  toPreview: ({ id }) => `
    <div style="overflow: hidden; padding-bottom: 56.25%; position: relative; height: 0;">
      <iframe
        style="left: 0;top: 0;height: 100%;width: 100%; position: absolute;"
        width="853"
        height="505"
        src="https://www.youtube.com/embed/${parseYouTubeID(id)}"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>`,
}

CMS.registerEditorComponent(youTube)
