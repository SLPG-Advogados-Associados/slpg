import React from 'react'
import { styled, classnames } from '../lib/styled'

const RawImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement> & {
  altAsCaption?: boolean
}> = ({ src, alt, title, altAsCaption, className, ...props }) => (
  <figure {...props} className={classnames('mb-8', className)}>
    <img src={src} alt={alt} title={title} />

    {alt && altAsCaption ? (
      <figcaption className="text-meta mt-6">{alt}</figcaption>
    ) : null}
  </figure>
)

const Image = styled(RawImage)``

export { Image }
