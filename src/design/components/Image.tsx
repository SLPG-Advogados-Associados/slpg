import React from 'react'

const Image: React.FC<React.ImgHTMLAttributes<HTMLImageElement> & {
  altAsCaption?: boolean
}> = ({ src, alt, title, altAsCaption, ...props }) => (
  <figure {...props}>
    <img src={src} alt={alt} title={title} />

    {alt && altAsCaption ? <figcaption>{alt}</figcaption> : null}
  </figure>
)

export { Image }
