import React from 'react'
import { classnames } from '../lib/styled'

const Image: React.FC<React.ImgHTMLAttributes<HTMLImageElement> & {
  altAsCaption?: boolean
}> = ({ src, alt, title, altAsCaption, className, ...props }) => (
  <figure {...props} className={classnames('mb-8', className)}>
    <img src={src} alt={alt} title={title} />

    {alt && altAsCaption ? (
      <figcaption className="text-meta mt-6">{alt}</figcaption>
    ) : null}
  </figure>
)

export { Image }
