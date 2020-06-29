const youTube = {
  id: 'youtube',
  label: 'YouTube',
  fields: [{ name: 'url', label: 'YouTube Video URL', widget: 'string' }],
  pattern: /^```youtube\n(\S+)\n```$/,
  fromBlock: match => ({ url: match[1] }),
  toBlock: ({ url }) => '```youtube\n' + url + '\n```',
  toPreview: ({ url }) => `
    <div style="overflow: hidden; padding-bottom: 56.25%; position: relative; height: 0;">
      <iframe
        style="left: 0;top: 0;height: 100%;width: 100%; position: absolute;"
        width="853"
        height="505"
        src="${url}"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>`,
}

CMS.registerEditorComponent(youTube)
